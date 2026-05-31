const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Local Auth (email + password + email OTP)
  phone: { type: String, index: true, default: "" },
  passwordHash: { type: String, default: "" }, // bcrypt hash

  // OTP verification (email)
  otpHash: { type: String, default: "" }, // bcrypt hash of the code
  otpExpiresAt: { type: Date, default: null },
  otpLastSentAt: { type: Date, default: null },

  // Profile (Firebase Auth)
  name: { type: String, default: "" },
  // NOTE: keep default "" to stay compatible with older Firebase-only users.
  // We enforce uniqueness in code (not via DB index) to avoid breaking old DBs that may contain duplicate empty emails.
  email: { type: String, index: true, lowercase: true, trim: true, default: "" },
  emailVerified: { type: Boolean, default: false },

  // Firebase auth (optional / backward compatible)
  firebaseUID: { type: String, unique: true, sparse: true },

  // Premium / subscription
  isPremium: { type: Boolean, default: false },
  premiumPlan: { type: String, default: "" }, // monthly/yearly/lifetime
  premiumUntil: { type: Date, default: null },
  razorpayCustomerId: { type: String, default: "" },
  razorpaySubscriptionId: { type: String, default: "" },

  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  wpm: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
