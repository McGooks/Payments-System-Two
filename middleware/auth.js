const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");
  //check if not token
  if (!token) {
    return res.status(401).json({ error: "Error, you must be log in to access this address" });
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
};
