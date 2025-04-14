require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.verifyToken = function(token) {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error);
    throw new Error("Token verification failed: " + error.message);
  }
};
