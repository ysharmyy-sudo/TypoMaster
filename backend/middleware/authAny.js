const User = require("../models/User");
const { initFirebaseAdmin } = require("../utils/firebaseAdmin");
const { verifyAccessToken } = require("../utils/jwt");

/**
 * Auth middleware (backward compatible):
 * - First tries our own JWT: Authorization: Bearer <APP_JWT>
 * - If JWT verification fails, falls back to Firebase ID token:
 *   Authorization: Bearer <FIREBASE_ID_TOKEN>
 */
module.exports = async function authAny(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // 1) Try our own JWT
  try {
    const decoded = verifyAccessToken(token);
    const userId = decoded?.sub || decoded?.userId || decoded?.id;
    if (!userId) throw new Error("Invalid token payload");

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    req.user = user;
    req.auth = { type: "jwt", decoded };
    return next();
  } catch {
    // ignore and fall back to Firebase
  }

  // 2) Try Firebase ID token (if configured)
  try {
    const admin = initFirebaseAdmin();
    const decoded = await admin.auth().verifyIdToken(token);

    const firebaseUID = decoded.uid;
    const email = decoded.email || "";
    const emailVerified = !!decoded.email_verified;

    let user = await User.findOne({ firebaseUID });
    if (!user) {
      user = await User.create({
        firebaseUID,
        email: (email || "").toLowerCase(),
        emailVerified,
        name: decoded.name || (email ? email.split("@")[0] : ""),
      });
    } else {
      const updates = {};
      if (email && user.email !== email.toLowerCase()) updates.email = email.toLowerCase();
      if (user.emailVerified !== emailVerified) updates.emailVerified = emailVerified;
      if (Object.keys(updates).length) await User.updateOne({ _id: user._id }, updates);
      user = await User.findById(user._id);
    }

    req.user = user;
    req.firebase = { uid: firebaseUID, email, emailVerified };
    req.auth = { type: "firebase", decoded };
    return next();
  } catch (err) {
    const msg = err?.message || "";
    if (msg.includes("Missing FIREBASE_SERVICE_ACCOUNT_JSON") || msg.includes("FIREBASE_SERVICE_ACCOUNT_BASE64")) {
      return res.status(500).json({ success: false, message: msg });
    }
    return res.status(401).json({ success: false, message: "Unauthorized (invalid/expired token)" });
  }
};

