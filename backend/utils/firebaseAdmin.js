const admin = require("firebase-admin");

/**
 * Initialize firebase-admin from a service account JSON stored in env.
 *
 * Recommended env:
 * - FIREBASE_SERVICE_ACCOUNT_JSON  (stringified JSON)
 *   OR
 * - FIREBASE_SERVICE_ACCOUNT_BASE64 (base64 of the JSON)
 */
function initFirebaseAdmin() {
  if (admin.apps.length) return admin;

  const jsonStr = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (!jsonStr && !b64) {
    throw new Error(
      "Missing FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_BASE64 in env"
    );
  }

  const serviceAccount = jsonStr
    ? JSON.parse(jsonStr)
    : JSON.parse(Buffer.from(b64, "base64").toString("utf8"));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return admin;
}

module.exports = { admin, initFirebaseAdmin };

