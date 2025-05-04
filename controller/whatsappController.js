const whatsappService = require("../services/whatsappService");
const puppeteerService = require("../services/puppeteerService");

const { createRegistrationMessage } = require("../messages/greetings");

exports.sendWhatsAppMessages = async (req, res) => {
	try {
		const result = await whatsappService.triggerMessages();
		res.json({ success: true, result });
	} catch (error) {
		console.error("WhatsApp Error:", error);
		res
			.status(500)
			.json({ success: false, message: "Error sending WhatsApp messages" });
	}
};

exports.sendTestMessages = async (req, res) => {
	try {
		const {
			name,
			phoneNo,
			std,
			competitions = "Drawing, Singing, Dancing",
		} = req.query;

		if (!name || !phoneNo || !std) {
			throw new Error("Missing required query parameters: name, phoneNo, or class");
		}

		const data = [
			{
				name,
				phoneNo,
				std,
				competitions,
			},
		];

		const result = await puppeteerService.openWhatsappWebAndSendMsg(
			data,
			createRegistrationMessage
		);
		res.json({ success: true, result });
	} catch (error) {
		console.error("WhatsApp Error:", error);
		res
			.status(500)
			.json({ success: false, message: "Error sending WhatsApp messages" });
	}
};
