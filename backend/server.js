const express = require("express");
const cors = require("cors");
require("dotenv").config();

// 🔥 Routes import
const paymentRoutes = require("./routes/payment");
const authRoutes = require("./routes/auth");

// 🔥 DB connect
const connectDB = require("./config/db");

const app = express();

// ✅ Connect Database
connectDB();

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});