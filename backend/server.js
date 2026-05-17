<<<<<<< HEAD
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const compression = require("compression");
require("dotenv").config();

// 🔥 Routes import
const paymentRoutes = require("./routes/payment");
const authRoutes = require("./routes/auth");

// 🔥 DB connect
const connectDB = require("./config/db");

const app = express();

// If hosted behind a proxy (Render, etc.)
app.set("trust proxy", 1);

// ✅ Connect Database
connectDB();

// ✅ Middlewares
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(mongoSanitize());
app.use(compression());

// Basic rate limit (tune as needed)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Routes
app.use("/api/payment", paymentRoutes);
app.use("/api/auth", authRoutes);

// ❌ Not Found Route (optional but pro)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server Error",
  });
});

// ✅ Port
const PORT = process.env.PORT || 5000;

=======
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ── Connect MongoDB ──────────────────────────────────────
connectDB();

// ── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payments', require('./routes/payments'));

// ── Health check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pariksha Typing Tutor backend is running' });
});

// ── 404 fallback ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Start server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
>>>>>>> 39a96ac736ae2ec4b42279a20571ac014a6a46eb
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
