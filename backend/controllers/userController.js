const User = require("../models/User");

// Create or Login user
exports.saveUser = async (req, res) => {
  try {
    const { firebaseUID, email } = req.body;

    let user = await User.findOne({ firebaseUID });

    if (!user) {
      user = await User.create({
        firebaseUID,
        email,
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update premium
exports.updatePremium = async (req, res) => {
  try {
    const { firebaseUID } = req.body;

    const user = await User.findOneAndUpdate(
      { firebaseUID },
      { isPremium: true },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};