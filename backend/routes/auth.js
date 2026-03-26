const express = require("express");
const router = express.Router();

const { saveUser, getUser } = require("../controllers/authController");

// ✅ save user
router.post("/save", saveUser);

// ✅ get user by firebase UID
router.get("/:uid", getUser);

module.exports = router;