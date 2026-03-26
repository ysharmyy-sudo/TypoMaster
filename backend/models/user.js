const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true },
  email: String,
  isPremium: { type: Boolean, default: false },

  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  wpm: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);