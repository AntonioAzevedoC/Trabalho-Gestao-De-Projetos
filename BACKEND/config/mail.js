const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // full Gmail address
    // Google App Password (spaces, if copied with them, are removed)
    pass: (process.env.EMAIL_PASSWORD || "").replace(/\s+/g, ""),
  },
  tls: { rejectUnauthorized: false },
});

module.exports = { transporter };
