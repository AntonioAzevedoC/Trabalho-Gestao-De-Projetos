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
    const { rows } = await db.query(q.qSelectActiveEmployees);

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
    const { rows } = await db.query(q.qSelectEmployeeById, [id]);
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

// Function to search for employee
// const searchForEmployees = async (req, res) => {
//   const searchText = req.params.searchText;

//   // Validating employee text request
//   if (!validate.validateDescription(searchText)) {
//     return res.status(400).json({
//       message: `Dados inválidos`,
//     });
//   }

//   // Searching for employees that match agains't the text
//   try {
//     const { rows } = await db.query(q.see, [
//       searchText.toLowerCase(),
//     ]);

//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Erro ao buscar funcionários." });
//   }
// };

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
      req.user.id,
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

  try {
    // Deactivating employee
    await db.query(q.qDeactivateEmployee, [Number(id)]);

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
  //   searchForEmployees,
  updateEmployee,
  deactivateEmployee,
  deleteEmployee,
};
