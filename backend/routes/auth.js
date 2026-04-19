const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/User');

// ── POST /api/auth/register ──────────────────────────────
// Called after Firebase creates the user on frontend
// Creates matching MongoDB document
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { uid, email } = req.user;
    const { name } = req.body;

    // Check if user already exists (handles double-calls)
    let user = await User.findOne({ uid });
    if (user) {
      return res.status(200).json({ message: 'User already exists', user });
    }

    user = await User.create({ uid, name, email });
    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Server error during registration' });
  }
});

// ── POST /api/auth/login ─────────────────────────────────
// Called after Firebase sign-in on frontend
// Updates lastLogin, returns MongoDB user profile
router.post('/login', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;

    const user = await User.findOneAndUpdate(
      { uid },
      { lastLogin: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

// ── GET /api/auth/me ─────────────────────────────────────
// Get current logged-in user's full profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid }).select('-payments');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// ── PATCH /api/auth/trials ───────────────────────────────
// Sync trial usage to MongoDB
router.patch('/trials', verifyToken, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { $inc: { trialsUsed: 1 } },
      { new: true }
    );
    return res.status(200).json({ trialsUsed: user.trialsUsed });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
