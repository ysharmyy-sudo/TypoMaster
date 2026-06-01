const express = require("express");
const router = express.Router();

const authAny = require("../middleware/authAny");
const { createSession, listSessions } = require("../controllers/sessionsController");

router.get("/", authAny, listSessions);
router.post("/", authAny, createSession);

module.exports = router;

