const express = require("express");
const router = express.Router();

const authAny = require("../middleware/authAny");
const {
  saveUser,
  getUser,
  me,
} = require("../controllers/authController");

const {
  signup,
  verifyOtp,
  resendOtp,
  login,
  updateProfile,
} = require("../controllers/localAuthController");

// ✅ Local Auth (Email + Password + OTP code)
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.patch("/profile", authAny, updateProfile);

// ✅ Firebase Auth (Bearer <idToken>)
// ✅ Works with BOTH app JWT and Firebase ID token
router.get("/me", authAny, me);

// ✅ Firebase compatible (existing)
router.post("/save", saveUser);

// Keep this last to avoid route conflicts
router.get("/:uid", getUser);

module.exports = router;
