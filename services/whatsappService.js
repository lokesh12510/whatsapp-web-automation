const sheetService = require("./sheetService");
const puppeteerService = require("./puppeteerService");
const { remainderForRegistrationMessage } = require("../messages/greetings");

exports.triggerMessages = async () => {
	const students = await sheetService.fetchPreviousRemainderData();

	console.log(students);

	const data = [
		{
			name: "Kishor",
			village: "Thambatty",
			phoneNo: "9786766751",
			isRegisteredIn2025: "No",
		},
		{
			name: "Shri",
			village: "Thambatty",
			phoneNo: "8870275991",
			isRegisteredIn2025: "No",
		},
		{
			name: "Harshath",
			village: "Thambatty",
			phoneNo: "9943622690",
			isRegisteredIn2025: "No",
		},
	];

	await puppeteerService.openWhatsappWebAndSendMsg(
		data,
		remainderForRegistrationMessage
	);

	return { message: "All messages sent successfully!" };
};
