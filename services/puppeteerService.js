const clipboardy = require("clipboardy");
const puppeteer = require("puppeteer");

async function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.openWhatsappWebAndSendMsg = async (data, renderMessage) => {
	const browser = await puppeteer.launch({
		headless: false,
		userDataDir: "../user_data", // keep WhatsApp logged in
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

	console.log(`Fetched ${data.length} entries from Google Sheets.`);

	for (const row of data) {
		const { name, phoneNo } = row;

		if (!name || !phoneNo) continue;

		const phone = "+91" + phoneNo.replace(/\D/g, ""); // clean and prefix
		const message = renderMessage(row);

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
			const inputBox = await page.$('div[contenteditable="true"]');

			// Copy message to clipboard
			await clipboardy.write(message);
			await inputBox.focus();

			// Paste message using keyboard
			await page.keyboard.down("Control");
			await page.keyboard.press("V");
			await page.keyboard.up("Control");

			await delay(1000); // Give a little time before sending

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

	await delay(10000); // Wait a bit before closing

	console.log("✅ All messages processed.");
	await browser.close();
};
