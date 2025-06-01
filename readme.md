# WhatsApp Web Automation 🤖💬

## Overview

This project automates the process of sending personalized WhatsApp messages to a large number of recipients. It integrates seamlessly with Google Sheets to fetch recipient details and message templates, enabling efficient and scalable communication for campaigns, notifications, or outreach programs.

### ✨ Key Features

- **Automated Messaging:** Send customized messages to multiple WhatsApp chats automatically.
- **Google Sheets Integration:** Fetch recipient data and message content directly from a specified Google Sheet.
- **Personalization:** Messages are tailored for each recipient based on the data in the sheet.
- **Scalable & Efficient:** Designed to handle large-scale messaging tasks with minimal manual intervention.

## 🛠️ Technical Stack & Tools Used

- **Node.js:** Core runtime for building the automation scripts.
- **Puppeteer:** Headless browser automation library used to control WhatsApp Web and perform messaging tasks programmatically.
- **Google Sheets API:** For reading recipient details and message templates from a Google Sheet.
- **Express.js:** (If used) For setting up API endpoints or webhooks (see `routes/` and `controller/` folders).
- **Modular Services:**
  - `puppeteerService.js`: Handles browser automation and WhatsApp Web interactions.
  - `sheetService.js`: Manages Google Sheets data retrieval.
  - `whatsappService.js`: Orchestrates message sending logic.
- **Config & Credentials:**
  - `creds.json`: Stores authentication details for Google Sheets API.
  - `user_data/`: Stores browser session data for persistent WhatsApp Web logins.

## 📁 Project Structure

- `app.js`, `index.js`: Entry points for running the automation.
- `controller/`, `routes/`: Organize business logic and API endpoints.
- `services/`: Core logic for WhatsApp and Google Sheets integration.
- `messages/`: Contains message templates or scripts.
- `user_data/`: Stores browser session and cache for Puppeteer.

## 🚀 Concepts Covered

- Browser automation with Puppeteer
- Google Sheets API integration
- Data-driven message personalization
- Modular Node.js application structure
- Scalable automation for messaging platforms

---

> 📝 **Open Source:** Contributions, issues, and feature requests are welcome! Feel free to fork, star, and submit pull requests to make this project even better.
