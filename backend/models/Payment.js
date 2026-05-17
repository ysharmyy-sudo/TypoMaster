const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    plan: { type: String, default: "" }, // monthly/yearly/lifetime
    amount: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    status: { type: String, default: "" }, // created/paid/failed

    razorpayOrderId: { type: String, default: "", index: true },
    razorpayPaymentId: { type: String, default: "", index: true },
    razorpaySignature: { type: String, default: "" },
    razorpaySubscriptionId: { type: String, default: "", index: true },
    razorpayPaymentLinkId: { type: String, default: "", index: true },

    raw: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
