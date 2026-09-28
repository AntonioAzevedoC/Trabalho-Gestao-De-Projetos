// Controller file to manage Refresh Tokens

// Importing Database connection
const db = require("../db");

// Importing queries
const { queries: q } = require("./queries/queries");

const crypto = require("crypto");
const jwt = require("jsonwebtoken"); // jsonwebtoken to create, well, JSON Web Tokens
require("dotenv").config();

// Function to handle Refresh Token (To generate new access tokens after they expired)
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  // If refresh token is missing return error (User must do login)
  if (!cookies?.refreshToken) return res.sendStatus(401);

  // Setting refresh token to a variable
  const refreshToken = cookies.refreshToken;

  // Hashing refresh token
  const hashToken = await crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Looking for user with that refresh token in database
  const [user] = await db.query(q.qSelectRefreshToken, [hashToken]);
  const foundUser = user[0];

  // If user isn't found, return error
  if (!foundUser || user.length === 0) return res.sendStatus(403); // Forbidden;

  // Evaluating if found refresh token is still valid
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    // Return error, in case data of an error, or if the data doesn't match
    if (err || foundUser.name !== decoded.username) return res.sendStatus(403); // Forbidden

    // Defining new access token
    const accessToken = jwt.sign(
      {
        userInfo: {
          userId: foundUser.id,
          username: foundUser.name,
          role: foundUser.id_role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      // { expiresIn: "20s" }, // FOR TESTING - 20 seconds to expire
      { expiresIn: "5m" },
    );

    // Sending Access Token as cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      // secure: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // better for dev
      // sameSite: "strict",
      // maxAge: 20 * 1000,
      maxAge: 5 * 60 * 1000,
    });

    res.sendStatus(200);
  });
};

module.exports = { handleRefreshToken };
