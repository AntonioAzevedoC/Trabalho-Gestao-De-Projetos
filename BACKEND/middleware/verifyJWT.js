// File to verify JSON Web Tokens

const jwt = require("jsonwebtoken"); // jsonwebtoken to create, well, JSON Web Tokens
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) return res.sendStatus(401);

  // Verifying Access Token
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403); // Invalid Token
      req.userId = decoded.userInfo.userId;
      req.user = decoded.userInfo.username;
      req.role = decoded.userInfo.role; // ADD PERMISSIONS ID HERE
      next();
    });
  } catch {
    return res.sendStatus(401);
  }
};

module.exports = verifyJWT;
