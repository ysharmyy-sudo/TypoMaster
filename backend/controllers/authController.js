const User = require("../models/User");

// ✅ Save user
exports.saveUser = async (req, res) => {
  try {
    const { firebaseUID, email } = req.body;

    let user = await User.findOne({ firebaseUID });

    if (!user) {
      user = new User({ firebaseUID, email });
      await user.save();
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get user
exports.getUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOne({ firebaseUID: uid });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};