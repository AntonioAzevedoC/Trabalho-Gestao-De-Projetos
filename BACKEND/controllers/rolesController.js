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

// Function to create role
const addRole = async (req, res) => {
  // Receiving role data
  let { name } = req.body;

  // Validating data
  if (!validate.validateName(name)) {
    return res.status(400).json({
      message: `Dados inválidos`,
    });
  }

  try {
    // Checking whether the role already exists
    const { rows: existingRoles } = await db.query(q.qSelectRoleByName, [
      name.trim().toLowerCase(),
    ]);

    if (existingRoles.length > 0) {
      return res.status(409).json({
        message: `Papel já cadastrado`,
      });
    }

    // Inserting new role
    const { rows } = await db.query(q.qAddRole, [name.trim().toLowerCase()]);

    // Sending successful status
    return res.status(201).json({
      message: "Papel cadastrado com sucesso",
      role: rows[0],
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Erro ao cadastrar papel.",
    });
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

  // Validating data
  if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({
      message: "ID de papel inválido.",
    });
  }

  try {
    // Finding role
    const { rows: roleRows } = await db.query(q.qSelectRoleById, [Number(id)]);

    // If role doesn't exist, return error
    if (!roleRows[0]) {
      return res.status(404).json({
        message: "Papel não encontrado.",
      });
    }

    // Checking whether the role is assigned to any user
    const { rows: userRows } = await db.query(q.qSelectUsersByRole, [
      Number(id),
    ]);

    if (userRows.length > 0) {
      return res.status(409).json({
        message:
          "Não é possível excluir este papel, pois existem usuários associados a ele.",
      });
    }

    // Removing role-permission associations
    await db.query(q.qDeleteAllRolePermissions, [Number(id)]);

    // Deleting role
    const { rows: deletedRows } = await db.query(q.qDeleteRole, [Number(id)]);

    if (deletedRows.length === 0) {
      return res.status(409).json({
        message: "Não foi possível excluir o papel.",
      });
    }

    // Sending successful status
    return res.status(200).json({
      message: "Papel excluído com sucesso.",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Erro ao excluir papel.",
    });
  }
};

// Exporting role functions
module.exports = {
  getAllRoles,
  getRoleByID,
  addRole,
  updateRole,
  deleteRole,
};
