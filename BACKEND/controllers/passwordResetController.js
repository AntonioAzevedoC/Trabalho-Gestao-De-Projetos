// File containing functions related password reset
const crypto = require("crypto");
const bcrypt = require("bcrypt"); // bcrypt to encrypt passwords
const jwt = require("jsonwebtoken"); // jsonwebtoken to create, well, JSON Web Tokens
require("dotenv").config();
const { transporter } = require("../config/mail");

// Importing database
const db = require("../db");

// Importing SQL queries
const { queries: q } = require("./queries/queries");

// Importing data validation
const validate = require("../helpers/dataValidation");

// Function to request password reset
const requestPasswordReset = async (req, res) => {
  const { email_usuario } = req.body;

  // Always return the same response regardless of whether the email exists.
  const genericResponse = {
    message: "O código foi enviado.",
  };

  if (
    typeof email_usuario !== "string" ||
    !validate.validateEmail(email_usuario)
  ) {
    return res.status(200).json(1);
  }

  try {
    const normalizedEmail = email_usuario.toLowerCase().trim();

    const { rows } = await db.query(q.qSelectUserByEmail, [normalizedEmail]);

    const user = rows[0];

    // Do not reveal whether the email exists.
    if (!user) {
      return res.status(200).json(2);
    }

    const resetCode = crypto.randomInt(100000, 1000000).toString();

    // Hash the code before putting it inside the JWT.
    const codeHash = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    // Temporary JWT session.
    const resetToken = jwt.sign(
      {
        userId: user.id,
        codeHash,
        purpose: "password-reset",
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "10m",
      },
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "Código para alterar senha",
      text: `Seu código para alteração de senha é: ${resetCode}. Esse código expira em 10 minutos.`,
      html: `
        <h2>Alteração de senha</h2>
        <p>Seu código para alteração de senha é:</p>
        <h1>${resetCode}</h1>
        <p>Esse código expira em 10 minutos.</p>
        <p>Se você não fez um pedido de alteração de senha, ignore esse e-mail.</p>
      `,
    });

    // Send the temporary token as an HTTP-only cookie.
    res.cookie("resetToken", resetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60 * 1000,
    });

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Erro ao fazer o pedido de alteração de senha:", error);

    // Do not expose internal errors or account existence.
    return res.status(200).json(3);
  }
};

// Function to verify reset code
const verifyResetCode = async (req, res) => {
  const { code } = req.body;
  const resetToken = req.cookies.resetToken;

  if (!resetToken || typeof code !== "string") {
    return res.status(401).json({
      message: "Código expirado, tente novamente.",
    });
  }

  try {
    const decoded = jwt.verify(resetToken, process.env.REFRESH_TOKEN_SECRET);

    if (decoded.purpose !== "password-reset") {
      return res.status(401).json({
        message: "Código expirado, tente novamente.",
      });
    }

    const codeHash = crypto.createHash("sha256").update(code).digest("hex");

    if (codeHash !== decoded.codeHash) {
      return res.status(401).json({
        message: "Código incorreto.",
      });
    }

    // Code was successfully verified
    const verifiedResetToken = jwt.sign(
      {
        userId: decoded.userId,
        purpose: "password-reset-verified",
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "10m",
      },
    );

    res.cookie("resetToken", verifiedResetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Código correto.",
    });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        message: "Código expirado, tente novamente.",
      });
    }

    console.error("Erro verificando o código:", error);

    return res.status(500).json({
      message: "Não foi possível verificar o código.",
    });
  }
};

// Function to create new password
const resetPassword = async (req, res) => {
  const { senha_usuario } = req.body;
  const resetToken = req.cookies.resetToken;

  if (!resetToken) {
    return res.status(401).json({
      message: "Código expirado, tente novamente.",
    });
  }

  if (
    typeof senha_usuario !== "string" ||
    !validate.validatePassword(senha_usuario)
  ) {
    return res.status(400).json({
      message: "Senha inválida.",
    });
  }

  try {
    const decoded = jwt.verify(resetToken, process.env.REFRESH_TOKEN_SECRET);

    if (decoded.purpose !== "password-reset-verified") {
      return res.status(401).json({
        message: "Código não foi verificado.",
      });
    }

    const passwordHash = await bcrypt.hash(senha_usuario, 10);

    await db.query(q.qUpdateUserPassword, [passwordHash, decoded.userId]);

    // Destroy the temporary reset session.
    res.clearCookie("resetToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Senha alterada!",
    });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        message: "Código expirado, tente novamente.",
      });
    }

    console.error("Erro ao alterar a senha:", error);

    return res.status(500).json({
      message: "Não foi possível alterar a senha.",
    });
  }
};

module.exports = { resetPassword, requestPasswordReset, verifyResetCode };
