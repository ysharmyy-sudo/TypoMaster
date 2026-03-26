const express = require("express");
const router = express.Router();

const { saveUser, updatePremium } = require("../controllers/userController");

router.post("/save", saveUser);
router.post("/premium", updatePremium);

module.exports = router;