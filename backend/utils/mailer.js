const nodemailer = require("nodemailer");

let cachedTransporter = null;

const sendViaResend = async ({ from, to, subject, html, text }) => {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  if (!apiKey) throw new Error("Missing RESEND_API_KEY");

  const payload = {
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    ...(html ? { html } : {}),
    ...(text ? { text } : {}),
  };

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(data?.message || data?.error || `Resend API error (${resp.status})`);
  }
  return data;
};

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
  //
  // NOTE (Render):
  // Some hosts block outbound port 465. Prefer STARTTLS on 587.
  const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "").trim() === "true" || port === 465;

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure, // true for 465, false for 587
    auth: { user, pass },
    // Make timeouts explicit so errors are clearer
    connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 20000),
    greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS || 20000),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 20000),
    ...(secure ? {} : { requireTLS: true }),
  });

  return cachedTransporter;
};

exports.sendEmail = async ({ to, subject, html, text }) => {
  const from = (process.env.RESEND_FROM || process.env.SMTP_FROM || process.env.SMTP_USER || "").trim();
  if (!from) throw new Error("Missing RESEND_FROM/SMTP_FROM/SMTP_USER for email sender");

  // Prefer Resend (HTTPS) if configured. Works on hosts that block outbound SMTP.
  const resendKey = (process.env.RESEND_API_KEY || "").trim();
  if (resendKey) {
    return sendViaResend({ from, to, subject, html, text });
  }

  const transporter = getTransporter();
  return transporter.sendMail({
    from,
    to,
    subject,
    ...(html ? { html } : {}),
    ...(text ? { text } : {}),
  });
};
