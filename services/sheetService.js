// sheetsService.js
const { google } = require("googleapis");
const path = require("path");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const KEY_FILE = path.join(__dirname, "../creds.json");

const authorize = async () => {
	const auth = new google.auth.GoogleAuth({
		keyFile: KEY_FILE,
		scopes: SCOPES,
	});
	return await auth.getClient();
};

const getSheetsInstance = async () => {
	const auth = await authorize();
	return google.sheets({ version: "v4", auth });
};

const fetchPreviousRemainderData = async () => {
	const sheets = await getSheetsInstance();

	const SHEET_ID = process.env.SHEET_ID;
	const SHEET_RANGE = "2024!A2:E"; // Adjust as needed

	console.log(SHEET_ID, SHEET_RANGE, "SHEET INFO");

	const response = await sheets.spreadsheets.values.get({
		spreadsheetId: SHEET_ID,
		range: SHEET_RANGE,
	});

	const rows = response.data.values || [];
	return rows.map((row) => ({
		name: row[0] || "",
		village: row[1] || "",
		phoneNo: row[2] || "",
		isRegisteredIn2025: row[3] || "",
		notified: row[4] || "",
	}));
};

// This function updates the notified number in the Google Sheet
// by setting the value in the last column to "success" for the given phone number.
const updateNotifiedNumber = async (phoneNo, status) => {
	const sheets = await getSheetsInstance();

	const SHEET_ID = process.env.SHEET_ID;
	const SHEET_RANGE = "2024!A2:E"; // Change range as per your sheet

	const response = await sheets.spreadsheets.values.get({
		spreadsheetId: SHEET_ID,
		range: SHEET_RANGE,
	});

	const rows = response.data.values || [];
	const rowIndex = rows.findIndex(
		(row) => row[2] === phoneNo && row[4] !== "success"
	);

	if (rowIndex !== -1) {
		await sheets.spreadsheets.values.update({
			spreadsheetId: SHEET_ID,
			range: `2024!E${rowIndex + 2}`,
			valueInputOption: "RAW",
			requestBody: {
				values: [[status]],
			},
		});
	}
};

// Export all individually and as a grouped object
module.exports = {
	authorize,
	getSheetsInstance,
	fetchPreviousRemainderData,
	updateNotifiedNumber,
};
