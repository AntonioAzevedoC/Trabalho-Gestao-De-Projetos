// Controller file to manage logout requests (Destrying refresh tokens, basically)

// Importing database connection
const db = require("../db");

// Importing queries
const { queries: q } = require("./queries/queries");

const crypto = require("crypto");

// Function to handle logout requests
const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  // If refresh token cookies are missig, return error
  if (!cookies?.refreshToken) return res.sendStatus(204); // Successful, but no Content

  const refreshToken = cookies.refreshToken;

  // Hashing refresh token
  const hashToken = await crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Looking for user with that refresh token in database
  const [user] = await db.query(q.qSelectRefreshToken, [hashToken]);
  const foundUser = user[0];

  // If there is a refresh token, but it has no user match
  if (!foundUser || user.length === 0) {
    // Clearing refresh token
    res.clearCookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // better for dev
      // sameSite: "strict",
    });

    // Clearing access tokens
    res.clearCookie("accessToken", refreshToken, {
      httpOnly: true,
      // secure: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // better for dev
      // sameSite: "strict",
    });

    return res.sendStatus(204); // Successful, but no Content
  }

  // Deleting refresh token from database
  await db.query(q.qDeleteRefreshTokenByID, [foundUser.id]);

  res.sendStatus(204);
};

module.exports = { handleLogout };
