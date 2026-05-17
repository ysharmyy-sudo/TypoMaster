const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Subscription = require("../models/Subscription");
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const nowPlusDays = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

const verifyHmac = (body, expected, secret) => {
  const actual = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
};

// ✅ Server-side pricing (prevents tampering)
// Subscription durations requested:
// 1 month: ₹99, 3 months: ₹199, 6 months: ₹499, 12 months: ₹999
const PLAN_PRICING = {
  m1: { amount: 99, currency: "INR", premiumDays: 30 },
  m3: { amount: 199, currency: "INR", premiumDays: 90 },
  m6: { amount: 499, currency: "INR", premiumDays: 180 },
  m12: { amount: 999, currency: "INR", premiumDays: 365 },
};

exports.createOrder = async (req, res) => {
  try {
    const { plan = "m1" } = req.body || {};
    const user = req.user;
    const pricing = PLAN_PRICING[plan];
    if (!pricing) return res.status(400).json({ success: false, message: "Invalid plan" });
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, message: "Razorpay is not configured (missing keys)" });
    }

    const options = {
      amount: Number(pricing.amount) * 100,
      currency: pricing.currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: String(user._id),
        plan,
      },
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      userId: user._id,
      plan,
      amount: Number(pricing.amount),
      currency: pricing.currency,
      status: "created",
      razorpayOrderId: order.id,
      raw: order,
    });

    // ✅ key_id is safe to expose; never expose key_secret.
    res.json({ success: true, order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyOrderPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment fields" });
    }

    const existing = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!existing) return res.status(404).json({ success: false, message: "Order not found" });
    const plan = existing.plan || "m1";
    const pricing = PLAN_PRICING[plan] || PLAN_PRICING.m1;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const ok = verifyHmac(body, razorpay_signature, process.env.RAZORPAY_KEY_SECRET);
    if (!ok) return res.status(400).json({ success: false, message: "Invalid signature" });

    // Idempotent update
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
      },
      { new: true }
    );

    // Premium activation
    const user = await User.findById(req.user._id);
    user.isPremium = true;
    user.premiumPlan = plan;
    user.premiumUntil = pricing.premiumDays ? nowPlusDays(pricing.premiumDays) : null;
    await user.save();

    res.json({ success: true, payment, user: { isPremium: user.isPremium, premiumPlan: user.premiumPlan, premiumUntil: user.premiumUntil } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSubscription = async (req, res) => {
  try {
    return res.status(400).json({
      success: false,
      message:
        "Subscription plan payments are disabled. Use payment link / one-time order payments instead.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifySubscriptionPayment = async (req, res) => {
  try {
    return res.status(400).json({
      success: false,
      message:
        "Subscription plan payments are disabled. Use payment link / one-time order payments instead.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Payment Links (no frontend key required)
exports.createPaymentLink = async (req, res) => {
  try {
    const { plan = "m1" } = req.body || {};
    const pricing = PLAN_PRICING[plan];
    if (!pricing) return res.status(400).json({ success: false, message: "Invalid plan" });
    const user = req.user;

    const frontendUrl = process.env.FRONTEND_URL || "";
    const callbackUrl = frontendUrl ? `${frontendUrl.replace(/\/$/, "")}/pricing?payment=success` : undefined;

    const link = await razorpay.paymentLink.create({
      amount: Number(pricing.amount) * 100,
      currency: pricing.currency,
      description: `Pariksha Typing Tutor - ${plan}`,
      customer: {
        name: user.name || "User",
        email: user.email || undefined,
      },
      notify: { email: true },
      ...(callbackUrl ? { callback_url: callbackUrl, callback_method: "get" } : {}),
      notes: { userId: String(user._id), plan },
    });

    await Payment.create({
      userId: user._id,
      plan,
      amount: Number(pricing.amount),
      currency: pricing.currency,
      status: "created",
      razorpayPaymentLinkId: link.id,
      raw: link,
    });

    res.json({ success: true, url: link.short_url, paymentLinkId: link.id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Confirm payment link status from server (no signature needed)
exports.confirmPaymentLink = async (req, res) => {
  try {
    const { paymentLinkId } = req.body || {};
    if (!paymentLinkId) return res.status(400).json({ success: false, message: "paymentLinkId required" });

    const link = await razorpay.paymentLink.fetch(paymentLinkId);
    const status = link?.status || "";

    await Payment.findOneAndUpdate(
      { razorpayPaymentLinkId: paymentLinkId },
      { status, raw: link },
      { upsert: true, new: true }
    );

    if (status === "paid") {
      const user = await User.findById(req.user._id);
      user.isPremium = true;
      user.premiumPlan = (link?.notes && link.notes.plan) || "m1";
      const pricing = PLAN_PRICING[user.premiumPlan] || PLAN_PRICING.m1;
      user.premiumUntil = pricing.premiumDays ? nowPlusDays(pricing.premiumDays) : null;
      await user.save();
      return res.json({ success: true, paid: true, user: { isPremium: user.isPremium, premiumPlan: user.premiumPlan } });
    }

    res.json({ success: true, paid: false, status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.webhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) return res.status(501).json({ success: false, message: "Webhook not configured (missing RAZORPAY_WEBHOOK_SECRET)" });
    if (!signature) return res.status(400).json({ success: false, message: "Missing signature" });

    const payload = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    const ok = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    if (!ok) return res.status(400).json({ success: false, message: "Invalid webhook signature" });

    const event = req.body;
    const eventType = event?.event || "";

    // Subscription events
    if (eventType.startsWith("subscription.")) {
      const sub = event.payload?.subscription?.entity;
      if (sub?.id) {
        await Subscription.findOneAndUpdate(
          { razorpaySubscriptionId: sub.id },
          {
            status: sub.status,
            currentStart: sub.current_start ? new Date(sub.current_start * 1000) : null,
            currentEnd: sub.current_end ? new Date(sub.current_end * 1000) : null,
            raw: sub,
          },
          { new: true }
        );

        const userId = sub.notes?.userId;
        if (userId) {
          const user = await User.findById(userId);
          if (user) {
            if (sub.status === "active") {
              user.isPremium = true;
              user.premiumPlan = sub.notes?.plan || user.premiumPlan || "monthly";
              user.premiumUntil = sub.current_end ? new Date(sub.current_end * 1000) : user.premiumUntil;
              user.razorpaySubscriptionId = sub.id;
              await user.save();
            }
            if (["cancelled", "completed", "halted"].includes(sub.status)) {
              user.isPremium = false;
              user.premiumPlan = "";
              user.premiumUntil = null;
              user.razorpaySubscriptionId = "";
              await user.save();
            }
          }
        }
      }
    }

    // Payment events
    if (eventType.startsWith("payment.")) {
      const pay = event.payload?.payment?.entity;
      if (pay?.id) {
        await Payment.findOneAndUpdate(
          { razorpayPaymentId: pay.id },
          {
            amount: pay.amount ? pay.amount / 100 : 0,
            currency: pay.currency,
            status: pay.status,
            raw: pay,
          },
          { upsert: true, new: true }
        );
      }
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.status = async (req, res) => {
  const u = req.user;
  res.json({
    success: true,
    isPremium: u.isPremium,
    premiumPlan: u.premiumPlan || "",
    premiumUntil: u.premiumUntil,
  });
};
