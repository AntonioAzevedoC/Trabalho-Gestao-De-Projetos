// Authetication controller, for user login

const crypto = require("crypto");
const bcrypt = require("bcrypt"); // bcrypt to encrypt passwords
const jwt = require("jsonwebtoken"); // jsonwebtoken to create, well, JSON Web Tokens
const fsPromises = require("fs").promises;
const path = require("path");
require("dotenv").config();

// Importing database
const db = require("../db");

// Importing SQL queries
const { queries: q } = require("./queries/queries");

// Importing data validation
const validate = require("../helpers/dataValidation");

// Function to handle login
const handleLogin = async (req, res) => {
  const { email_usuario, senha_usuario } = req.body;

  // If email or password are missing, return error
  if (!email_usuario || !senha_usuario)
    return res.status(400).json({ Message: "Email e senha são necessários." });

  // Validating user data
  if (
    !validate.validateEmail(email_usuario) ||
    !validate.validatePassword(senha_usuario)
  )
    return res.status(401).json({
      message: `Dados inválidos`,
    });

  // Looking for user in database via email
  try {
    // Searching for match
    const { rows } = await db.query(q.qSelectUserByEmail, [
      email_usuario.toLowerCase(),
    ]);
    const user = rows[0];

    // Send error message if user isn't found
    if (!user || user.length === 0) {
      return res.status(400).json({
        message: `Usuário com email ${email_usuario} não encontrado`,
      });
    }

    // Send error message if user isn't approved yet
    if (user.status_active) {
      return res.status(400).json({
        message: `Usuário não está aprovado, entre em contato com um supervisor`,
      });
    }

    // If user exists, check if the password matches
    const match = await bcrypt.compare(senha_usuario, user.password_hash);

    // If match happens, create JSON Web Tokens
    if (match) {
      // Creating JWTs (JSON Web Tokens)

      // Creating Access Token
      const accessToken = jwt.sign(
        {
          userInfo: {
            userId: user.id,
            username: user.name,
            role: user.id_role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" },
        // { expiresIn: "20s" }, // FOR TESTING - 30 seconds to expire
      );

      // Creating Refresh Token
      const refreshToken = jwt.sign(
        {
          userId: user.id,
          username: user.name,
          role: user.id_role,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "15m" },
        // { expiresIn: "1m" }, // FOR TESTING - 1 day till it expires
      );

      // Saving the refresh token to a database, so that it can be manually destroyed at any point (For a log out)
      try {
        // Calculating expiration date
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Converting expiration date to datetime, I hate dates
        const expirationDate = `${expiresAt.getFullYear()}-${
          String(expiresAt.getMonth() + 1).length === 1
            ? "0" + (expiresAt.getMonth() + 1)
            : expiresAt.getMonth() + 1
        }-${String(expiresAt.getDate()).length === 1 ? "0" + expiresAt.getDate() : expiresAt.getDate()} ${String(expiresAt.getHours()).length === 1 ? "0" + expiresAt.getHours() : expiresAt.getHours()}:${String(expiresAt.getMinutes()).length === 1 ? "0" + expiresAt.getMinutes() : expiresAt.getMinutes()}:00`; // 24 hours

        // Hashing refresh token
        const hashToken = await crypto
          .createHash("sha256")
          .update(refreshToken)
          .digest("hex");

        // Deleting old refresh token, if it exists
        // await db.query(q.qDeleteRefreshTokenByID, [user.id]);

        // // Inserting refreshToken in database
        // await db.query(q.qAddRefreshToken, [
        //   user.id,
        //   hashToken,
        //   expirationDate,
        // ]);

        // Sending Refresh Token as http only cookie, so that it is not reachable by hackers (This word does sound a bit corny), the age of the token is also set to 1 full day, in milliseconds
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          // secure: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax", // better for dev
          // sameSite: "strict",
          // maxAge: 24 * 60 * 60 * 1000,
          // maxAge: 1 * 60 * 1000,
          maxAge: 15 * 60 * 1000,
        });

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

        const userId = user.id;
        const username = user.nome_usuario;
        const role = user.id_funcao;

        res.json({ userId, username, role });
        // Sending response status
        res.sendStatus(200);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    console.error(err.message);
    console.error(err.position);
    res.status(500).json(err);
  }
};

module.exports = { handleLogin };
