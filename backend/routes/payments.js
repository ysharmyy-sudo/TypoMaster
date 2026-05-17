const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Plan amounts in paise (1 rupee = 100 paise)
const PLAN_AMOUNTS = {
  pro: 29900,       // ₹299
  lifetime: 99900,  // ₹999
};

// ── POST /api/payments/create-order ─────────────────────
// Creates a Razorpay order and returns order_id to frontend
router.post('/create-order', verifyToken, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!PLAN_AMOUNTS[plan]) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const options = {
      amount: PLAN_AMOUNTS[plan],
      currency: 'INR',
      receipt: `receipt_${req.user.uid}_${Date.now()}`,
      notes: {
        userId: req.user.uid,
        plan,
      },
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return res.status(500).json({ error: 'Could not create payment order' });
  }
});

// ── POST /api/payments/verify ────────────────────────────
// Verifies Razorpay payment signature and upgrades user in MongoDB
router.post('/verify', verifyToken, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, plan } = req.body;

    // Verify signature using HMAC-SHA256
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ error: 'Payment verification failed: invalid signature' });
    }

    // Signature matched — upgrade user in MongoDB
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        isPremium: true,
        plan: plan,
        $push: {
          payments: {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            amount: PLAN_AMOUNTS[plan],
            plan,
          },
        },
      },
      { new: true }
    );

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ error: 'Server error during payment verification' });
  }
});

module.exports = router;
