const sheetService = require("./sheetService");
const puppeteerService = require("./puppeteerService");
const { remainderForRegistrationMessage } = require("../messages/greetings");

exports.triggerMessages = async () => {
	const students = await sheetService.fetchPreviousRemainderData();

	const filteredStudents = students.filter(
		(student) =>
			student.isRegisteredIn2025 === "No" &&
			student.notified !== "success" &&
			student.notified !== "failed"
	);

	const data = filteredStudents.slice(0, 15); // Limit to 15 messages at a time

	console.log(data);

	if (data.length === 0) {
		console.log("No students to notify.");
		return { message: "No students to notify." };
	}

	await puppeteerService.openWhatsappWebAndSendMsg(
		data,
		remainderForRegistrationMessage,
		async (phoneNo, status) => {
			await sheetService.updateNotifiedNumber(phoneNo, status);
		}
	);

	return { message: "All messages sent successfully!" };
};
