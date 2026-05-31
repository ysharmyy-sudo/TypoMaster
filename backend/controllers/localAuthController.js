const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendEmail } = require("../utils/mailer");
const { signAccessToken } = require("../utils/jwt");

const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 10);
const OTP_RESEND_COOLDOWN_SECONDS = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60);

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const normalizePhone = (phone) => String(phone || "").trim();

const generateOtpCode = () => String(Math.floor(100000 + Math.random() * 900000));

const sendOtpEmail = async ({ to, code }) => {
  const appName = (process.env.APP_NAME || "Pariksha Typing Tutor").trim();
  const ttl = OTP_TTL_MINUTES;

  const subject = `${appName} verification code: ${code}`;
  const text = `Your ${appName} verification code is ${code}. It expires in ${ttl} minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin:0 0 12px;">${appName} - Email Verification</h2>
      <p style="margin:0 0 10px;">Use this code to verify your account:</p>
      <div style="font-size: 28px; font-weight: 800; letter-spacing: 4px; margin: 10px 0 16px;">
        ${code}
      </div>
      <p style="margin:0 0 10px; color:#444;">This code expires in <b>${ttl} minutes</b>.</p>
      <p style="margin:18px 0 0; color:#888; font-size: 12px;">
        If you didn’t request this, you can ignore this email.
      </p>
    </div>
  `;

  await sendEmail({ to, subject, text, html });
};

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const phone = normalizePhone(req.body?.phone);
    const password = String(req.body?.password || "");
    const name = String(req.body?.name || "").trim();

    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    if (!phone) return res.status(400).json({ success: false, message: "Phone is required" });
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    let user = await User.findOne({ email });
    if (user && user.emailVerified) {
      return res.status(409).json({ success: false, message: "Account already exists. Please login." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = generateOtpCode();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    if (!user) {
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        phone,
        passwordHash,
        emailVerified: false,
        otpHash,
        otpExpiresAt,
        otpLastSentAt: new Date(),
      });
    } else {
      user.phone = phone;
      user.passwordHash = passwordHash;
      if (name) user.name = name;
      user.otpHash = otpHash;
      user.otpExpiresAt = otpExpiresAt;
      user.otpLastSentAt = new Date();
      await user.save();
    }

    try {
      await sendOtpEmail({ to: email, code: otp });
    } catch (mailErr) {
      // Helpful for Render logs
      // eslint-disable-next-line no-console
      console.error("❌ OTP email send failed:", mailErr?.message || mailErr);
      return res.status(500).json({
        success: false,
        message:
          "Unable to send verification email. Please re-check SMTP_USER/SMTP_PASS (Gmail App Password) or use a transactional email provider.",
      });
    }
    return res.json({ success: true, message: "Verification code sent to your email." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Server error" });
  }
};

// POST /api/auth/resend-otp
exports.resendOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.emailVerified) return res.status(400).json({ success: false, message: "Email already verified. Please login." });

    if (user.otpLastSentAt) {
      const diff = (Date.now() - new Date(user.otpLastSentAt).getTime()) / 1000;
      if (diff < OTP_RESEND_COOLDOWN_SECONDS) {
        return res.status(429).json({
          success: false,
          message: `Please wait ${Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - diff)} seconds before requesting a new code.`,
        });
      }
    }

    const otp = generateOtpCode();
    user.otpHash = await bcrypt.hash(otp, 10);
    user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    user.otpLastSentAt = new Date();
    await user.save();

    try {
      await sendOtpEmail({ to: email, code: otp });
    } catch (mailErr) {
      // eslint-disable-next-line no-console
      console.error("❌ OTP resend email failed:", mailErr?.message || mailErr);
      return res.status(500).json({
        success: false,
        message:
          "Unable to resend verification email. Please re-check SMTP_USER/SMTP_PASS (Gmail App Password) or use a transactional email provider.",
      });
    }
    return res.json({ success: true, message: "Verification code resent." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Server error" });
  }
};

// POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const code = String(req.body?.code || "").trim();
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    if (!code) return res.status(400).json({ success: false, message: "Code is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({ success: false, message: "No active verification code. Please request a new one." });
    }
    if (new Date(user.otpExpiresAt).getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: "Code expired. Please request a new one." });
    }

    const ok = await bcrypt.compare(code, user.otpHash);
    if (!ok) return res.status(400).json({ success: false, message: "Invalid code" });

    user.emailVerified = true;
    user.otpHash = "";
    user.otpExpiresAt = null;
    user.otpLastSentAt = null;
    await user.save();

    const token = signAccessToken({ sub: String(user._id) });

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: !!user.emailVerified,
        isPremium: !!user.isPremium,
        premiumPlan: user.premiumPlan || "",
        premiumUntil: user.premiumUntil,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Server error" });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    if (!password) return res.status(400).json({ success: false, message: "Password is required" });

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
    if (!user.emailVerified) {
      return res.status(403).json({ success: false, message: "Please verify your email first." });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ success: false, message: "Invalid email or password" });

    const token = signAccessToken({ sub: String(user._id) });
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: !!user.emailVerified,
        isPremium: !!user.isPremium,
        premiumPlan: user.premiumPlan || "",
        premiumUntil: user.premiumUntil,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Server error" });
  }
};

// PATCH /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const name = String(req.body?.name || "").trim();
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });
    user.name = name;
    await user.save();
    return res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Server error" });
  }
};
