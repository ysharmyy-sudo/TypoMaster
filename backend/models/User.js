const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Profile (Firebase Auth)
  name: { type: String, default: "" },
  email: { type: String, index: true, default: "" },
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
