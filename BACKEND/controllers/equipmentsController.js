// Controller file for equipment related queries

// Importing database
const db = require("../db");

// Importing queries file
const { queries: q } = require("./queries/queries");

// Importing validation helper functions
const validate = require("../helpers/dataValidation");

// Function to list all equipment
const getAllEquipment = async (req, res) => {
  try {
    const { rows } = await db.query(q.qSelectAllEquipment);

    return res.status(200).json({
      equipment: rows,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Erro ao listar equipamentos.",
    });
  }
};

// Function to get equipment by ID
const getEquipmentByID = async (req, res) => {
  const { id } = req.params.id;

  try {
    const { rows } = await db.query(q.qSelectEquipmentById, [Number(id)]);

    return res.status(200).json({
      equipment: rows,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Equipamento não encontrado.",
    });
  }
};

// Function to add new equipment
const addEquipment = async (req, res) => {
  let {
    name,
    id_equipment_type,
    id_equipment_status,
    heritage_code,
    id_sector,
    observation,
  } = req.body;

  const userId = Number(req.id);

  // Normalize optional fields
  name = typeof name === "string" ? name.trim() : "";
  heritage_code = typeof heritage_code === "string" ? heritage_code.trim() : "";
  observation =
    typeof observation === "string" ? observation.trim() || null : null;

  // Normalize optional sector
  if (id_sector === "" || id_sector === undefined || id_sector === null) {
    id_sector = null;
  }

  // Validate input
  if (
    !validate.validateName(name) ||
    !Number.isInteger(Number(id_equipment_type)) ||
    Number(id_equipment_type) <= 0 ||
    !Number.isInteger(Number(id_equipment_status)) ||
    Number(id_equipment_status) <= 0 ||
    !heritage_code ||
    heritage_code.length > 20 ||
    (observation !== null && observation.length > 20) ||
    !Number.isInteger(userId) ||
    userId <= 0 ||
    (id_sector !== null &&
      (!Number.isInteger(Number(id_sector)) || Number(id_sector) <= 0))
  ) {
    return res.status(400).json({
      message: "Dados inválidos.",
    });
  }

  try {
    // Validate equipment type
    const { rows: typeRows } = await db.query(q.qSelectEquipmentTypeById, [
      Number(id_equipment_type),
    ]);

    if (!typeRows.length) {
      return res.status(400).json({
        message: "Tipo de equipamento não encontrado.",
      });
    }

    // Validate equipment status
    const { rows: statusRows } = await db.query(q.qSelectEquipmentStatusById, [
      Number(id_equipment_status),
    ]);

    if (!statusRows.length) {
      return res.status(400).json({
        message: "Status de equipamento não encontrado.",
      });
    }

    // Validate sector if provided
    if (id_sector !== null) {
      const { rows: sectorRows } = await db.query(q.qSelectSectorById, [
        Number(id_sector),
      ]);

      if (!sectorRows.length) {
        return res.status(400).json({
          message: "Setor não encontrado.",
        });
      }
    }

    // Check duplicate heritage code
    const { rows: existingEquipment } = await db.query(
      q.qSelectEquipmentByHeritageCode,
      [heritage_code],
    );

    if (existingEquipment.length > 0) {
      return res.status(409).json({
        message: "Código patrimonial já cadastrado.",
      });
    }

    // Register equipment
    const { rows } = await db.query(q.qAddEquipment, [
      name,
      Number(id_equipment_type),
      Number(id_equipment_status),
      heritage_code,
      id_sector === null ? null : Number(id_sector),
      observation,
      userId,
    ]);

    return res.status(201).json({
      message: "Equipamento cadastrado com sucesso.",
      equipment: rows[0],
    });
  } catch (err) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(409).json({
        message: "Código patrimonial já cadastrado.",
      });
    }

    if (err.code === "23503") {
      return res.status(400).json({
        message: "Uma das referências informadas não existe.",
      });
    }

    return res.status(500).json({
      message: "Erro ao cadastrar equipamento.",
    });
  }
};

// Function to edit equipment
const updateEquipment = async (req, res) => {
  let { id, name, id_equipment_type, heritage_code, id_sector, observation } =
    req.body;

  const userId = Number(req.user.id);

  if (
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0 ||
    !validate.validateName(name) ||
    !Number.isInteger(Number(id_equipment_type)) ||
    Number(id_equipment_type) <= 0 ||
    !heritage_code ||
    heritage_code.length > 20 ||
    (observation !== null && observation.length > 20) ||
    !Number.isInteger(userId) ||
    userId <= 0 ||
    (id_sector !== null &&
      (!Number.isInteger(Number(id_sector)) || Number(id_sector) <= 0))
  ) {
    return res.status(400).json({
      message: "Dados inválidos.",
    });
  }

  try {
    // Check whether equipment exists
    const { rows: equipmentRows } = await db.query(q.qSelectEquipmentById, [
      Number(id),
    ]);

    if (!equipmentRows.length) {
      return res.status(404).json({
        message: "Equipamento não encontrado.",
      });
    }

    // Validate equipment type
    const { rows: typeRows } = await db.query(q.qSelectEquipmentTypeById, [
      Number(id_equipment_type),
    ]);

    if (!typeRows.length) {
      return res.status(400).json({
        message: "Tipo de equipamento não encontrado.",
      });
    }

    // Validate sector if provided
    if (id_sector !== null) {
      const { rows: sectorRows } = await db.query(q.qSelectSectorById, [
        Number(id_sector),
      ]);

      if (!sectorRows.length) {
        return res.status(400).json({
          message: "Setor não encontrado.",
        });
      }
    }

    // Check duplicate heritage code on other records
    const { rows: duplicateRows } = await db.query(
      q.qCheckDuplicateHeritageCode,
      [heritage_code, Number(id)],
    );

    if (duplicateRows.length > 0) {
      return res.status(409).json({
        message: "Código patrimonial já cadastrado.",
      });
    }

    // Update equipment
    const { rows } = await db.query(q.qUpdateEquipment, [
      name,
      Number(id_equipment_type),
      heritage_code,
      id_sector === null ? null : Number(id_sector),
      observation,
      userId,
      Number(id),
    ]);

    return res.status(200).json({
      message: "Equipamento atualizado com sucesso.",
      equipment: rows[0],
    });
  } catch (err) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(409).json({
        message: "Código patrimonial já cadastrado.",
      });
    }

    if (err.code === "23503") {
      return res.status(400).json({
        message: "Uma das referências informadas não existe.",
      });
    }

    return res.status(500).json({
      message: "Erro ao atualizar equipamento.",
    });
  }
};

// Function to change equipment status
const updateEquipmentStatus = async (req, res) => {
  const { id, id_equipment_status } = req.body;
  const userId = Number(req.id);

  if (
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0 ||
    !Number.isInteger(Number(id_equipment_status)) ||
    Number(id_equipment_status) <= 0 ||
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    return res.status(400).json({
      message: "Dados inválidos.",
    });
  }

  try {
    // Check whether equipment exists
    const { rows: equipmentRows } = await db.query(q.qSelectEquipmentById, [
      Number(id),
    ]);

    if (!equipmentRows.length) {
      return res.status(404).json({
        message: "Equipamento não encontrado.",
      });
    }

    // Validate new status
    const { rows: statusRows } = await db.query(q.qSelectEquipmentStatusById, [
      Number(id_equipment_status),
    ]);

    if (!statusRows.length) {
      return res.status(400).json({
        message: "Status de equipamento não encontrado.",
      });
    }

    // Update status and record responsible user
    const { rows } = await db.query(q.qUpdateEquipmentStatus, [
      Number(id_equipment_status),
      userId,
      Number(id),
    ]);

    return res.status(200).json({
      message: "Status do equipamento atualizado com sucesso.",
      equipment: rows[0],
    });
  } catch (err) {
    console.error(err);

    if (err.code === "23503") {
      return res.status(400).json({
        message: "Status ou usuário responsável não encontrado.",
      });
    }

    return res.status(500).json({
      message: "Erro ao atualizar status do equipamento.",
    });
  }
};

// Exporting equipment functions
module.exports = {
  getAllEquipment,
  getEquipmentByID,
  addEquipment,
  updateEquipment,
  updateEquipmentStatus,
};
