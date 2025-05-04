const express = require("express");
const router = express.Router();
const whatsappController = require("../controller/whatsappController");

router.post("/remainder-to-register", whatsappController.sendWhatsAppMessages);
router.get("/test", whatsappController.sendTestMessages);

module.exports = router;
