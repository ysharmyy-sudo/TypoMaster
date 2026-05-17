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

exports.createOrder = async (req, res) => {
  try {
    if (!req.user?.emailVerified) {
      return res.status(403).json({ success: false, message: "Please verify your email in Firebase before making payment." });
    }
    const { amount, plan = "lifetime" } = req.body;
    const user = req.user;

    const options = {
      amount: amount * 100,
      currency: "INR",
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
      amount,
      currency: "INR",
      status: "created",
      razorpayOrderId: order.id,
      raw: order,
    });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyOrderPayment = async (req, res) => {
  try {
    if (!req.user?.emailVerified) {
      return res.status(403).json({ success: false, message: "Please verify your email in Firebase before making payment." });
    }
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan = "lifetime",
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const ok = verifyHmac(body, razorpay_signature, process.env.RAZORPAY_KEY_SECRET);
    if (!ok) return res.status(400).json({ success: false, message: "Invalid signature" });

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
        plan,
      },
      { new: true }
    );

    // Premium activation (lifetime order)
    const user = await User.findById(req.user._id);
    user.isPremium = true;
    user.premiumPlan = plan;
    user.premiumUntil = plan === "lifetime" ? null : user.premiumUntil;
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
    if (!req.user?.emailVerified) {
      return res.status(403).json({ success: false, message: "Please verify your email in Firebase before making payment." });
    }
    const { amount = 999, plan = "lifetime" } = req.body || {};
    const user = req.user;

    const frontendUrl = process.env.FRONTEND_URL || "";
    const callbackUrl = frontendUrl ? `${frontendUrl.replace(/\/$/, "")}/pricing?payment=success` : undefined;

    const link = await razorpay.paymentLink.create({
      amount: Number(amount) * 100,
      currency: "INR",
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
      amount: Number(amount),
      currency: "INR",
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
    if (!req.user?.emailVerified) {
      return res.status(403).json({ success: false, message: "Please verify your email in Firebase before making payment." });
    }
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
      user.premiumPlan = (link?.notes && link.notes.plan) || "lifetime";
      user.premiumUntil = null;
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
