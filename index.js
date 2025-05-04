require("dotenv").config();
const puppeteer = require("puppeteer");
const { google } = require("googleapis");
const path = require("path");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const SHEET_ID = process.env.SHEET_ID; // Replace with your actual Google Sheet ID
const SHEET_RANGE = "Sheet1!A2:D"; // Skip header row

async function getSheetData() {
	const auth = new google.auth.GoogleAuth({
		keyFile: path.join(__dirname, "creds.json"),
		scopes: SCOPES,
	});
	const sheets = google.sheets({ version: "v4", auth });
	const res = await sheets.spreadsheets.values.get({
		spreadsheetId: SHEET_ID,
		range: SHEET_RANGE,
	});
	return res.data.values;
}

function createMessage(name, className, competitions) {
	return `Hello ${name}! 👋

We are happy to inform you that your registration for *Talent Chase* has been received. You're participating in the following competition(s): *${competitions}*.

📚 Class: ${className}

📅 Stay tuned for event updates via WhatsApp.

Best wishes! ✨`;
}

async function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendWhatsAppMessages() {
	const browser = await puppeteer.launch({
		headless: false,
		userDataDir: "./user_data", // keep WhatsApp logged in
		timeout: 0,
		defaultViewport: null,
		args: ["--start-maximized"],
	});

	const page = await browser.newPage();

	console.log("Opening WhatsApp Web...");
	await page.goto("https://web.whatsapp.com", { waitUntil: "networkidle2" });

	// Wait until WhatsApp Web is ready
	await page.waitForSelector('div[title="Chats"]', { timeout: 0 });
	console.log("WhatsApp Web ready.");

	const rows = await getSheetData();
	console.log(`Fetched ${rows.length} entries from Google Sheets.`);

	for (const row of rows) {
		const [name, rawPhone, className, competitions] = row;

		if (!name || !rawPhone) continue;

		const phone = "+91" + rawPhone.replace(/\D/g, ""); // clean and prefix
		const message = createMessage(name, className, competitions);

		const url = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
			message
		)}`;

		console.log(`Sending message to ${name} (${phone})...`);
		await page.goto(url);

		try {
			const notOnWhatsApp = await page.evaluate(() => {
				return Array.from(document.querySelectorAll("div")).some((el) =>
					el.textContent.includes("not on WhatsApp")
				);
			});

			if (notOnWhatsApp) {
				console.warn(`❌ ${name} (${phone}) is not on WhatsApp. Skipping.`);
				continue;
			}

			// Wait for input to receive message (ensure message is typed)
			await page.waitForSelector('div[contenteditable="true"]', { timeout: 10000 });

			// Double-check the message box contains our message
			const typedMessage = await page.$eval(
				'div[contenteditable="true"]',
				(el) => el.innerText
			);
			if (!typedMessage.includes(name)) {
				console.warn(`⚠️ Message not typed for ${name}, retrying...`);
				await page.type('div[contenteditable="true"]', message);
				await delay(1000);
			}

			// Click send button via evaluate if needed
			await page.waitForSelector('button[aria-label="Send"]', { timeout: 10000 });

			await page.evaluate(() => {
				const sendBtn = document.querySelector('button[aria-label="Send"]');
				if (sendBtn) sendBtn.click();
			});

			console.log(`✅ Message sent to ${name} (${phone})`);

			await delay(20000); // Wait before sending next message
		} catch (error) {
			console.error(`❌ Failed to send to ${name} (${phone}):`, error.message);
		}
	}

	console.log("✅ All messages processed.");
	await browser.close();
}

sendWhatsAppMessages().catch(console.error);
