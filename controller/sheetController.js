const sheetService = require("../services/sheetService");

exports.getPreviousYearRemainder = async (req, res) => {
	try {
		const data = await sheetService.fetchPreviousRemainderData();
		res.json({ success: true, data });
	} catch (error) {
		console.error("Sheet Fetch Error:", error);
		res.status(500).json({ success: false, message: "Error fetching sheet data" });
	}
};
