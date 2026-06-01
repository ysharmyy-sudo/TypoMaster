const mongoose = require("mongoose");

const typingSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    ts: { type: Number, required: true }, // epoch ms (client-side)
    examId: { type: String, default: "default" },
    examTitle: { type: String, default: "Typing Test" },
    durationMin: { type: Number, default: 1 },
    language: { type: String, default: "english" },
    wpm: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    typedChars: { type: Number, default: 0 },
    correctChars: { type: Number, default: 0 },
    errorCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

typingSessionSchema.index({ userId: 1, ts: -1 });

module.exports = mongoose.model("TypingSession", typingSessionSchema);
