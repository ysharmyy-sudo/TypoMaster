const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
  const secret = (process.env.JWT_SECRET || "").trim();
  if (!secret) throw new Error("Missing JWT_SECRET in environment");
  return secret;
};

exports.signAccessToken = (payload) => {
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d").trim();
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
};

exports.verifyAccessToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

