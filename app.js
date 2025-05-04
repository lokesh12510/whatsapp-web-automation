require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON payloads
app.use(express.json());

// GET request for root
app.get("/", (req, res) => {
	res.json({ success: true, message: "Connected to api" });
});

const sheetRoutes = require("./routes/sheetRoutes");
const whatsappRoutes = require("./routes/whatsappRoutes");

app.use("/api/sheet", sheetRoutes);
app.use("/api/whatsapp", whatsappRoutes);

// Sample POST request
app.post("/api/new-entry", (req, res) => {
	const body = req.body;

	console.log(body);

	// For now, just return a success response
	res.json({ success: true, message: "Sheet processed successfully", body });
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
