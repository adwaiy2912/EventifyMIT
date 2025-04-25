# 🛠️ EventifyMIT - Setup Guide

This document will walk you through setting up the **EventifyMIT** project on your local machine.

---

## 🧰 Prerequisites

Make sure you have the following installed:

-  **Node.js** (v18+ recommended)
-  **npm** (comes with Node.js)
-  **PostgreSQL** (or access to [Neon](https://neon.tech) database)
-  **Git**

---

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/adwaiy2912/EventifyMIT.git
   cd EventifyMIT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

---

## ⚙️ Environment Setup

1. **Create a `.env` file in the root directory:**

   ```bash
   # Server Setup
   PORT=3000

   # Database Setup (Neon)
   PGHOST=your_pg_host  # Example: 'db.neon.tech'
   PGDATABASE='neondb'  # Your Neon database name
   PGUSER='neondb_owner'  # Your Neon database user
   PGPASSWORD=your_pg_password  # Your Neon database password
   ENDPOINT_ID=your_endpoint_id  # Get this from your Neon dashboard

   # Email Setup (SMTP)
   SMTP_HOST=your_email_host  # Example: 'smtp.ethereal.email'
   SMTP_EMAIL=your_email_id  # Your email address (e.g., 'your-email@domain.com')
   SMTP_PASS=your_email_password  # Your email password (use an app-specific password if available)

   # Twilio Setup (For OTP & SMS)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid  # Get this from your Twilio console
   TWILIO_AUTH_TOKEN=your_twilio_auth_token  # Get this from your Twilio console
   TWILIO_PHONE_NUMBER=your_twilio_phone_number  # Your Twilio phone number (e.g., '+1234567890')

   # Session Setup
   SESSION_SECRET=your_session_secret_key  # A unique secret key for session encryption (e.g., use a strong, random string)
   ```

   -  Neon Database: If you are using Neon, get your database connection details (host, database name, user, password, and endpoint) from your Neon dashboard. Replace the placeholders with your actual details.
   -  SMTP Setup: If you’re using a service like Ethereal Email for SMTP, you can generate credentials for testing purposes. Alternatively, you can use any SMTP service provider (like Gmail, SendGrid, etc.).
   -  Twilio Setup: Make sure you have an active Twilio account to send SMS or OTPs. Use your Twilio Account SID, Auth Token, and a valid Twilio Phone Number to set up SMS functionality.

2. **(Optional) Seed your database**

   If you have seeders or want to sync your schema:

   ```bash
   npm run sync
   ```

---

## 🚀 Running the App

```bash
npm start
```

The server will be live at:

```
http://localhost:3000
```

---

## 🧪 Development Tips

-  Use `nodemon` for auto-restarts:

   ```bash
   npx nodemon src/app.js
   ```

-  Use tools like **Postman** or **Thunder Client** to test routes.

---

## 📂 Project Structure

See [README.md](./README.md) for a detailed overview of the file structure.
