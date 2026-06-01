const TypingSession = require("../models/TypingSession");

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// POST /api/sessions
exports.createSession = async (req, res) => {
  try {
    const user = req.user;
    const body = req.body || {};

    const ts = Number(body.ts || Date.now());
    const errorCount = Number(
      // backward compatible: older clients may send `errors`
      body.errorCount ?? body.errors ?? 0
    );
    const doc = await TypingSession.create({
      userId: user._id,
      ts,
      examId: String(body.examId || "default"),
      examTitle: String(body.examTitle || "Typing Test"),
      durationMin: Number(body.durationMin || 1),
      language: String(body.language || "english"),
      wpm: Number(body.wpm || 0),
      accuracy: Number(body.accuracy || 0),
      typedChars: Number(body.typedChars || 0),
      correctChars: Number(body.correctChars || 0),
      errorCount,
    });

    return res.json({ success: true, session: doc });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Server error" });
  }
};

// GET /api/sessions?days=30&limit=500
exports.listSessions = async (req, res) => {
  try {
    const user = req.user;
    const days = clamp(Number(req.query.days || 30), 1, 365);
    const limit = clamp(Number(req.query.limit || 500), 1, 2000);

    const fromTs = Date.now() - days * 24 * 60 * 60 * 1000;

    const sessions = await TypingSession.find({
      userId: user._id,
      ts: { $gte: fromTs },
    })
      .sort({ ts: 1 })
      .limit(limit)
      .lean();

    return res.json({ success: true, sessions });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Server error" });
  }
};
