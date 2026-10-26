// Controller file for shift related queries

// Importing database
const db = require("../db");

// Importing queries file
const { queries: q } = require("./queries/queries");

// Importing validation helper functions
const validate = require("../helpers/dataValidation");

// Function to get all shifts
const getAllShifts = async (req, res) => {
  try {
    const result = await db.query(q.qSelectShifts);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao listar turnos:", error);

    return res.status(500).json({
      message: "Não foi possível recuperar os turnos.",
    });
  }
};

// Function to add shift
const addShift = async (req, res) => {
  try {
    const { name, hour_start, hour_end } = req.body;

    if (
      typeof name !== "string" ||
      !validate.validateName(name.trim()) ||
      !validate.validateTime(hour_start) ||
      !validate.validateTime(hour_end)
    ) {
      return res.status(400).json({
        message: "Dados inválidos.",
      });
    }

    const normalizedName = name.trim();

    const existing = await db.query(q.qSelectShiftByName, [normalizedName]);

    if (existing.rowCount > 0) {
      return res.status(409).json({
        message: "Um turno com esse nome já existe.",
      });
    }

    const result = await db.query(q.qAddShift, [
      normalizedName,
      hour_start,
      hour_end,
    ]);

    return res.status(201).json({
      message: "Turno registrado.",
      shift: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Um turno com esse nome já existe.",
      });
    }

    console.error("Erro ao registrar turno:", error);

    return res.status(500).json({
      message: "Não foi possível registrar o turno.",
    });
  }
};

// Function to update a shift

const updateShift = async (req, res) => {
  try {
    const { id, name, hour_start, hour_end } = req.body;

    if (
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0 ||
      typeof name !== "string" ||
      !validate.validateName(name.trim()) ||
      !validate.validateTime(hour_start) ||
      !validate.validateTime(hour_end)
    ) {
      return res.status(400).json({
        message: "Dados inválido.",
      });
    }

    const shiftId = Number(id);
    const normalizedName = name.trim();

    const existingShift = await db.query(q.qSelectShiftById, [shiftId]);

    if (existingShift.rowCount === 0) {
      return res.status(404).json({
        message: "Turno não encontrado.",
      });
    }

    const duplicate = await db.query(q.qSelectShiftByNameExceptId, [
      normalizedName,
      shiftId,
    ]);

    if (duplicate.rowCount > 0) {
      return res.status(409).json({
        message: "Já existe um turno que utiliza esse nome.",
      });
    }

    const result = await db.query(q.qUpdateShift, [
      normalizedName,
      hour_start,
      hour_end,
      shiftId,
    ]);

    return res.status(200).json({
      message: "Turno atualizado.",
      shift: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Já existe um turno que utiliza esse nome.",
      });
    }

    console.error("Erro ao atualizar turno:", error);

    return res.status(500).json({
      message: "Não foi possível atualizar o turno.",
    });
  }
};

// Function to delete a shift
const deleteShift = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID inválido.",
      });
    }

    const existingShift = await db.query(q.qSelectShiftById, [id]);

    if (existingShift.rowCount === 0) {
      return res.status(404).json({
        message: "Turno não encontrado.",
      });
    }

    const usage = await db.query(q.qSelectShiftEmployeeUsage, [id]);

    if (usage.rows[0].total > 0) {
      return res.status(409).json({
        message: "Não é possível deletar um turno com funcionários associados.",
      });
    }

    const result = await db.query(q.qDeleteShift, [id]);

    return res.status(200).json({
      message: "Turno deletado com sucesso.",
      shift: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(409).json({
        message: "Não é possível deletar um turno com funcionários associados.",
      });
    }

    console.error("Erro ao deletar turno:", error);

    return res.status(500).json({
      message: "Não foi possível deletar o turno.",
    });
  }
};

// Exporting shift functions
module.exports = {
  getAllShifts,
  addShift,
  updateShift,
  deleteShift,
};
