const { google } = require("googleapis");
const path = require("path");

async function authorize() {
	const auth = new google.auth.GoogleAuth({
		keyFile: path.join(__dirname, "../creds.json"),
		scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
	});
	return await auth.getClient();
}

exports.fetchPreviousRemainderData = async () => {
	const auth = await authorize();
	const sheets = google.sheets({ version: "v4", auth });

	const SHEET_ID = process.env.SHEET_ID;
	const SHEET_RANGE = "2024!A2:D"; // Change range as per your sheet

	console.log(SHEET_ID, SHEET_RANGE, "SHEET INFO");

	const response = await sheets.spreadsheets.values.get({
		spreadsheetId: SHEET_ID,
		range: SHEET_RANGE,
	});

	const rows = response.data.values;
	return rows.map((row) => ({
		name: row[0],
		village: row[1],
		phoneNo: row[2],
		isRegisteredIn2025: row[3],
	}));
};
