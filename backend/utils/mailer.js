const nodemailer = require("nodemailer");

let cachedTransporter = null;

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASS || "").trim();

  if (!user || !pass) {
    throw new Error("Missing SMTP_USER/SMTP_PASS for nodemailer");
  }

  // Gmail App Password flow:
  // - SMTP_USER = your Gmail address
  // - SMTP_PASS = 16-char app password (requires 2FA enabled)
  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  return cachedTransporter;
};

exports.sendEmail = async ({ to, subject, html, text }) => {
  const from = (process.env.SMTP_FROM || process.env.SMTP_USER || "").trim();
  if (!from) throw new Error("Missing SMTP_FROM/SMTP_USER for email sender");

  const transporter = getTransporter();
  return transporter.sendMail({
    from,
    to,
    subject,
    ...(html ? { html } : {}),
    ...(text ? { text } : {}),
  });
};

