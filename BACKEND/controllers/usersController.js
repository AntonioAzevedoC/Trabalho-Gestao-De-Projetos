// Controller file for user related queries

// Importing database
const db = require("../db");

// Importing queries file
const { queries: q } = require("./queries/queries");

// Importing validation helper functions
const validate = require("../helpers/dataValidation");

// Function to list all users
const getAllUsers = async (req, res) => {
  try {
    // Creating array with results
    const { rows } = await db.query(q.qSelectAllUsers);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar usuários." });
  }
};

// Function to get a user data by their ID
const getUserByID = async (req, res) => {
  // ID for user being searched for
  const id_usuario = req.params.id;

  // Finding user
  try {
    // Searching for user
    const { rows } = await db.query(q.qSelectUserByID, [id_usuario]);
    const user = rows[0];

    // Send error message if user isn't found
    if (!user) {
      return res.status(400).json({
        message: `Usuário não encontrado`,
      });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar usuário." });
  }
};

// Function to search for user
const searchForUsers = async (req, res) => {
  const searchText = req.params.searchText;

  // Validating user text request
  if (!validate.validateDescription(searchText)) {
    return res.status(400).json({
      message: `Dados inválidos`,
    });
  }

  // Searching for users that match agains't the text
  try {
    const { rows } = await db.query(q.qSelectUsersFullTextSearch, [
      searchText.toLowerCase(),
    ]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar usuários." });
  }
};

// Function to update user
const updateUser = async (req, res) => {
  // Finding user
  let { id_usuario, nome_usuario, email_usuario, id_funcao } = req.body;

  // Validating data
  if (
    !validate.validateName(nome_usuario) ||
    !validate.validateEmail(email_usuario) ||
    !validate.validateRole(id_funcao)
  )
    return res.status(400).json({
      message: `Dados inválidos`,
    });

  try {
    // Finding user to guarantee it isn't an admin user (Those should not be chageable)
    const { rows } = await db.query(q.qSelectUserByID, [Number(id_usuario)]);
    const currentUserdata = rows[0];

    // If user doesn't exist, return error
    if (!currentUserdata) {
      return res.status(400).json({
        message: `Usuário não encontrado`,
      });
    }

    // Updating employee data
    await db.query(q.qUpdateUser, [
      nome_usuario.toLowerCase(),
      email_usuario.toLowerCase(),
      id_funcao,
      id_usuario,
    ]);

    // Seding successful status
    res.status(201).json({ message: "Dados de usuário atualizados" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar usuário." });
  }
};

// Function to deactivate user
const deactivateUser = async (req, res) => {
  // ID for user being deleted (Made deactive, for foreign table's purpouse)
  const id_usuario = req.params.id;

  try {
    // Deactivating user
    await db.query(q.qDeactivateUser, [Number(id_usuario)]);

    res.status(201).json({ message: "Usuário desativado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao desativar usuário." });
  }
};

// Function to delete user from database
const deleteUser = async (req, res) => {
  // ID for user being deleted
  const id_usuario = req.params.id;

  try {
    // Deleting user
    await db.query(q.qDeleteUser, [id_usuario]);

    // Return message for sucesseful deletion
    res.status(201).json({ message: "Usuário deletado." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao deletar usuário." });
  }
};

// Exporting user functions
module.exports = {
  getAllUsers,
  getUserByID,
  searchForUsers,
  updateUser,
  deactivateUser,
  deleteUser,
};
