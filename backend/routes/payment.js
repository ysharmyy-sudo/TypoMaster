const express = require("express");
const router = express.Router();

const {
  createPaymentLink,
  confirmPaymentLink,
  createOrder,
  verifyOrderPayment,
  webhook,
  status,
} = require("../controllers/paymentController");

const authAny = require("../middleware/authAny");

// Payment Links (no frontend key needed)
router.post("/create-payment-link", authAny, createPaymentLink);
router.post("/confirm-payment-link", authAny, confirmPaymentLink);

// Orders (one-time)
router.post("/create-order", authAny, createOrder);
router.post("/verify-order", authAny, verifyOrderPayment);

// Webhook (no auth; signature verified inside)
router.post("/webhook", webhook);

// Premium status
router.get("/status", authAny, status);

module.exports = router;
