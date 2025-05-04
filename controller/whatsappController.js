const whatsappService = require("../services/whatsappService");

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
