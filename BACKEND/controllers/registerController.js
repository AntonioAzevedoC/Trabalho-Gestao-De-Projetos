// File for register controller, for adding a password to a user

const bcrypt = require("bcrypt"); // Module for cryptography

// Importing database
const db = require("../db");

// // Importing SQL queries
const { queries: q } = require("./queries/queries");

// Importing validation functions
const validate = require("../helpers/dataValidation");

// Function to create new user
const registerUser = async (req, res) => {
  const { nome_usuario, email_usuario, senha_usuario, id_funcao } = req.body;

  // If email or password is missing, return error
  if (!email_usuario || !senha_usuario)
    return res
      .status(400)
      .json({ Message: "É necessário digitar email e senha." });

  // Validating user data
  if (
    !validate.validateName(nome_usuario) ||
    !validate.validateEmail(email_usuario) ||
    !validate.validatePassword(senha_usuario) ||
    !validate.validateRole(id_funcao)
  )
    return res.status(400).json({
      message: `Dados inválidos`,
    });

  // In case everything is well
  try {
    // Encrypting and salting the password in 10 rounds (Standard)
    let hashedPwd = await bcrypt.hash(senha_usuario, 10);

    // Adding new user
    await db.query(q.qAddNewUser, [
      nome_usuario.toLowerCase(),
      email_usuario.toLowerCase(),
      hashedPwd,
      id_funcao,
    ]);

    // Sending success status
    res.status(201).json({ message: `Usuário cadastrado.` });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { registerUser };
