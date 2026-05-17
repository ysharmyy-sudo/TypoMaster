const User = require("../models/User");
const { initFirebaseAdmin } = require("../utils/firebaseAdmin");

/**
 * Auth middleware:
 * - Firebase Auth (recommended): Authorization: Bearer <FIREBASE_ID_TOKEN>
 */
module.exports = async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!idToken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const admin = initFirebaseAdmin();
    const decoded = await admin.auth().verifyIdToken(idToken);

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
      // keep email/emailVerified in sync
      const updates = {};
      if (email && user.email !== email.toLowerCase()) updates.email = email.toLowerCase();
      if (user.emailVerified !== emailVerified) updates.emailVerified = emailVerified;
      if (Object.keys(updates).length) await User.updateOne({ _id: user._id }, updates);
      user = await User.findById(user._id);
    }

    req.user = user;
    req.firebase = { uid: firebaseUID, email, emailVerified };
    return next();
  } catch (err) {
    const msg = err?.message || "";
    // If firebase-admin is not configured on the server, surface a clear error.
    if (msg.includes("Missing FIREBASE_SERVICE_ACCOUNT_JSON") || msg.includes("FIREBASE_SERVICE_ACCOUNT_BASE64")) {
      return res.status(500).json({ success: false, message: msg });
    }
    return res.status(401).json({ success: false, message: "Unauthorized (invalid/expired token)" });
  }
};
