<<<<<<< HEAD
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
=======
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Firebase UID — primary link between Firebase Auth and MongoDB
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Subscription & trial tracking
    isPremium: {
      type: Boolean,
      default: false,
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'lifetime'],
      default: 'free',
    },
    trialsUsed: {
      type: Number,
      default: 0,
    },

    // Razorpay payment records
    payments: [
      {
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,
        amount: Number,       // in paise (₹299 = 29900)
        plan: String,         // 'pro' | 'lifetime'
        paidAt: { type: Date, default: Date.now },
      },
    ],

    // Usage analytics
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    totalTestsCompleted: {
      type: Number,
      default: 0,
    },
    bestWpm: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
>>>>>>> 39a96ac736ae2ec4b42279a20571ac014a6a46eb
