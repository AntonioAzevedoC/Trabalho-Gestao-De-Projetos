// Controller file for employee related queries

// Importing database
const db = require("../db");

// Importing queries file
const { queries: q } = require("./queries/queries");

// Importing validation helper functions
const validate = require("../helpers/dataValidation");

// Function to list all employees
const getAllEmployees = async (req, res) => {
  try {
    // Creating array with results
    const { rows } = await db.query(q.qSelectEmployees);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar funcionários." });
  }
};

// Function to get a employee data by their ID
const getEmployeeByID = async (req, res) => {
  // ID for employee being searched for
  const id = req.params.id;

  // Finding employee
  try {
    // Searching for employee
    const { rows } = await db.query(q.qSelectEmployeeFullById, [id]);
    const employee = rows[0];

    // Send error message if employee isn't found
    if (!employee) {
      return res.status(400).json({
        message: `Funcionário não encontrado`,
      });
    }

    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar funcionário." });
  }
};

// FUnction to add new employees
const addEmployee = async (req, res) => {
  // Receiving employee data
  let {
    name,
    id_position,
    code_employee,
    login_main_system,
    id_sector,
    id_shift,
  } = req.body;

  // Getting the ID of the authenticated user
  const id_user_create = req.id;

  // Validating data
  if (
    !validate.validateName(name) ||
    !Number.isInteger(Number(id_position)) ||
    Number(id_position) <= 0 ||
    !Number.isInteger(Number(id_shift)) ||
    Number(id_shift) <= 0 ||
    !Number.isInteger(id_user_create)
  ) {
    return res.status(400).json({
      message: "Dados inválidos",
    });
  }

  try {
    // Registering employee
    const { rows } = await db.query(q.qAddEmployee, [
      name,
      Number(id_position),
      code_employee,
      login_main_system,
      id_sector === null ? null : Number(id_sector),
      Number(id_shift),
      id_user_create,
    ]);

    // Sending successful status
    return res.status(201).json({
      message: "Funcionário cadastrado com sucesso",
      employee: rows[0],
    });
  } catch (err) {
    console.error(err);

    // Handling invalid foreign-key references
    if (err.code === "23503") {
      return res.status(400).json({
        message: "Cargo, setor, turno ou usuário responsável não encontrado.",
      });
    }

    return res.status(500).json({
      message: "Erro ao cadastrar funcionário.",
    });
  }
};

// Function to update employee
const updateEmployee = async (req, res) => {
  // Finding employee
  let {
    id,
    name,
    id_position,
    code_employee,
    login_main_system,
    id_sector,
    id_shift,
  } = req.body;

  // Validating data
  if (!validate.validateName(name)) {
    return res.status(400).json({
      message: `Dados inválidos`,
    });
  }

  try {
    // Finding employee
    const { rows } = await db.query(q.qSelectEmployeeById, [Number(id)]);

    const currentEmployeeData = rows[0];

    // If employee doesn't exist, return error
    if (!currentEmployeeData) {
      return res.status(400).json({
        message: `Funcionário não encontrado`,
      });
    }

    // Updating employee data
    await db.query(q.qUpdateEmployee, [
      name.toLowerCase(),
      id_position,
      code_employee,
      login_main_system,
      id_sector,
      id_shift,
      18,
      Number(id),
    ]);

    // Sending successful status
    res.status(200).json({
      message: "Dados de funcionário atualizados",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erro ao atualizar funcionário.",
    });
  }
};

// Function to deactivate employee
const deactivateEmployee = async (req, res) => {
  // ID for employee being deactivated (Made deactive, for foreign table's purpouse)
  const id = req.params.id;
  // ID for user making the call
  const id_user = req.params.id_user;

  try {
    // Deactivating employee
    await db.query(q.qDeactivateEmployee, [Number(id_user), Number(id)]);

    res.status(201).json({ message: "Funcionário desativado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao desativar funcionário." });
  }
};

// Function to delete employee from database
const deleteEmployee = async (req, res) => {
  // ID for employee being deleted
  const id = req.params.id;

  try {
    // Deleting employee
    await db.query(q.qDeleteEmployee, [id]);

    // Return message for sucesseful deletion
    res.status(201).json({ message: "Funcionário deletado." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao deletar funcionário." });
  }
};

// Exporting employee functions
module.exports = {
  getAllEmployees,
  getEmployeeByID,
  addEmployee,
  updateEmployee,
  deactivateEmployee,
  deleteEmployee,
};
