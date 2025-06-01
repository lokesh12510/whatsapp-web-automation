const { createRemainderMessage } = require("../messages/greetings");
const sheetService = require("../services/sheetService");
const puppeteerService = require("../services/puppeteerService");

exports.getPreviousYearRemainder = async (req, res) => {
	try {
		const data = await sheetService.fetchPreviousRemainderData();
		res.json({ success: true, data });
	} catch (error) {
		console.error("Sheet Fetch Error:", error);
		res.status(500).json({ success: false, message: "Error fetching sheet data" });
	}
};
exports.getRemainderGroup = async (req, res) => {
	try {
		const data = await sheetService.fetchPreviousRemainderData();

		const filteredData = data?.filter(
			(student) =>
				student.isRegisteredIn2025 === "No" && student.notified === "success"
		);

		if (!filteredData || filteredData.length === 0) {
			return res.status(404).json({ success: false, message: "No data found" });
		}

		// Group the data by std while filtering it
		const groupedData = filteredData.reduce((acc, student) => {
			if (student.isRegisteredIn2025 === "No" && student.notified === "success") {
				const { std } = student;
				if (!acc[std]) {
					acc[std] = [];
				}
				acc[std].push(student);
			}
			return acc;
		}, {});

		// Convert the grouped data into an array of objects
		const filteredArray = Object.entries(groupedData).map(([std, students]) => ({
			std,
			students,
			name: "Lokesh",
			phoneNo: "8098174100",
		}));

		await puppeteerService.openWhatsappWebAndSendMsg(
			filteredArray,
			createRemainderMessage
		);

		res.json({ success: true, message: "Messages sent successfully!" });
	} catch (error) {
		console.error("Sheet Fetch Error:", error);
		res.status(500).json({ success: false, message: "Error fetching sheet data" });
	}
};
