require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.verifyToken = function(token)
{
  try
  {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded;
  }
  catch (error)
  {
    throw new Error("Token verification failed: " + error.message);
  }
};
