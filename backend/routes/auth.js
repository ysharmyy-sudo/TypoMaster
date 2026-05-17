const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  saveUser,
  getUser,
  me,
} = require("../controllers/authController");

// ✅ Firebase Auth (Bearer <idToken>)
router.get("/me", auth, me);

// ✅ Firebase compatible (existing)
router.post("/save", saveUser);

// Keep this last to avoid route conflicts
router.get("/:uid", getUser);

module.exports = router;
