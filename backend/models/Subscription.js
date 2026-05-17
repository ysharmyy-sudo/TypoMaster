const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    plan: { type: String, default: "" }, // monthly/yearly
    status: { type: String, default: "" }, // created/active/cancelled/completed/...

    razorpayPlanId: { type: String, default: "" },
    razorpaySubscriptionId: { type: String, default: "", index: true },
    razorpayCustomerId: { type: String, default: "" },

    currentStart: { type: Date, default: null },
    currentEnd: { type: Date, default: null },

    raw: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);

