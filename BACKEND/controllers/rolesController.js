// Controller file for role related queries

// Importing database
const db = require("../db");

// Importing queries file
const { queries: q } = require("./queries/queries");

// Importing validation helper functions
const validate = require("../helpers/dataValidation");

// Function to list all roles
const getAllRoles = async (req, res) => {
  try {
    // Creating array with results
    const { rows } = await db.query(q.qSelectRoles);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar papels." });
  }
};

// Function to get a role data by their ID
const getRoleByID = async (req, res) => {
  // ID for role being searched for
  const id = req.params.id;

  // Finding role
  try {
    // Searching for role
    const { rows } = await db.query(q.qSelectRoleById, [id]);
    const role = rows[0];

    // Send error message if role isn't found
    if (!role) {
      return res.status(400).json({
        message: `Papel não encontrado`,
      });
    }

    res.json(role);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar papel." });
  }
};

// Function to update role
const updateRole = async (req, res) => {
  // Finding role
  let { id, name } = req.body;

  // Validating data
  if (!id || !validate.validateName(name)) {
    return res.status(400).json({
      message: `Dados inválidos`,
    });
  }

  try {
    // Finding role
    const { rows } = await db.query(q.qSelectRoleById, [Number(id)]);

    const currentRoleData = rows[0];

    // If role doesn't exist, return error
    if (!currentRoleData) {
      return res.status(400).json({
        message: `Papel não encontrado`,
      });
    }

    // Updating role
    await db.query(q.qUpdateRole, [name.toLowerCase(), Number(id)]);

    // Sending successful status
    res.status(200).json({
      message: "Dados de papel atualizados",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erro ao atualizar papel.",
    });
  }
};

// Function to delete role from database
const deleteRole = async (req, res) => {
  // ID for role being deleted
  const id = req.params.id;

  try {
    // Deleting role
    await db.query(q.qDeleteRole, [id]);

    // Return message for sucesseful deletion
    res.status(201).json({ message: "Papel deletado." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao deletar papel." });
  }
};

// Exporting role functions
module.exports = {
  getAllRoles,
  getRoleByID,
  updateRole,
  deleteRole,
};
