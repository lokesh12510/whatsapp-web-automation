const express = require("express");
const router = express.Router();
const sheetController = require("../controller/sheetController");

router.get(
	"/get-last-year-participants",
	sheetController.getPreviousYearRemainder
);

router.get("/get-remainder-group", sheetController.getRemainderGroup);

module.exports = router;
