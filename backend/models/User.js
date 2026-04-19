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
