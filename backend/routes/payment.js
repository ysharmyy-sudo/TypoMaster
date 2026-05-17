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

const auth = require("../middleware/auth");

// Payment Links (no frontend key needed)
router.post("/create-payment-link", auth, createPaymentLink);
router.post("/confirm-payment-link", auth, confirmPaymentLink);

// Orders (one-time)
router.post("/create-order", auth, createOrder);
router.post("/verify-order", auth, verifyOrderPayment);

// Webhook (no auth; signature verified inside)
router.post("/webhook", webhook);

// Premium status
router.get("/status", auth, status);

module.exports = router;
