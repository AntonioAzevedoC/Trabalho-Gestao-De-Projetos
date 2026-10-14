// Controller file for attendance related queries

// Importing database
const db = require("../db");

// Importing queries file
const { queries: q } = require("./queries/queries");

// Importing validation helper functions
const validate = require("../helpers/dataValidation");

// Function to list attendance
// Works with either an employee's ID, or a date, or both
const getAttendance = async (req, res) => {
  const { date, employeeId } = req.query;

  try {
    let result;

    if (employeeId !== undefined && date !== undefined) {
      if (
        !/^[1-9]\d*$/.test(String(employeeId)) ||
        !validate.validateDate(date)
      ) {
        return res.status(400).json({
          message: "Parâmetros de consulta inválidos.",
        });
      }

      result = await db.query(q.qSelectAttendanceByEmployeeAndDate, [
        Number(employeeId),
        date,
      ]);
    } else if (date !== undefined) {
      if (!validate.validateDate(date)) {
        return res.status(400).json({
          message: "Data inválida.",
        });
      }

      result = await db.query(q.qSelectAttendanceByDate, [date]);
    } else if (employeeId !== undefined) {
      if (!/^[1-9]\d*$/.test(String(employeeId))) {
        return res.status(400).json({
          message: "ID de funcionário inválido.",
        });
      }

      result = await db.query(q.qSelectAttendanceByEmployee, [
        Number(employeeId),
      ]);
    } else {
      return res.status(400).json({
        message: "Informe uma data, um funcionário ou ambos.",
      });
    }

    return res.status(200).json({
      attendance: result.rows,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Erro ao consultar presença.",
    });
  }
};

// Function to add attendance
const addAttendance = async (req, res) => {
  const { id_employee, id_attendance_status, date, observation } = req.body;

  const userId = Number(req.id);

  // Validate required fields
  if (
    !Number.isInteger(Number(id_employee)) ||
    Number(id_employee) <= 0 ||
    !Number.isInteger(Number(id_attendance_status)) ||
    Number(id_attendance_status) <= 0 ||
    !validate.validateDate(date) ||
    (observation != null &&
      (typeof observation !== "string" || observation.length > 255)) ||
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    return res.status(400).json({
      message: "Dados inválidos.",
    });
  }

  try {
    // Check employee
    const { rows: employees } = await db.query(
      q.qSelectAttendanceEmployeeById,
      [Number(id_employee)],
    );

    if (!employees.length) {
      return res.status(404).json({
        message: "Funcionário não encontrado.",
      });
    }

    // Check status
    const { rows: statuses } = await db.query(q.qSelectAttendanceStatusById, [
      Number(id_attendance_status),
    ]);

    if (!statuses.length) {
      return res.status(400).json({
        message: "Status de presença não encontrado.",
      });
    }

    // Check existing attendance for this employee and date
    const { rows: existing } = await db.query(
      q.qSelectAttendanceByEmployeeAndDate,
      [Number(id_employee), date],
    );

    if (existing.length) {
      return res.status(409).json({
        message:
          "Já existe um registro de presença para este funcionário nesta data.",
      });
    }

    // Register attendance
    const { rows } = await db.query(q.qAddAttendance, [
      Number(id_employee),
      Number(id_attendance_status),
      date,
      observation?.trim() || null,
      userId,
    ]);

    return res.status(201).json({
      message: "Presença registrada com sucesso.",
      attendance: rows[0],
    });
  } catch (err) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(409).json({
        message:
          "Já existe um registro de presença para este funcionário nesta data.",
      });
    }

    if (err.code === "23503") {
      return res.status(400).json({
        message: "Uma das referências informadas não existe.",
      });
    }

    return res.status(500).json({
      message: "Erro ao registrar presença.",
    });
  }
};

// Function to update attendance
const updateAttendance = async (req, res) => {
  const { id, id_attendance_status, observation } = req.body;

  const userId = Number(req.id);

  if (
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0 ||
    !Number.isInteger(Number(id_attendance_status)) ||
    Number(id_attendance_status) <= 0 ||
    (observation != null &&
      (typeof observation !== "string" || observation.length > 255)) ||
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    return res.status(400).json({
      message: "Dados inválidos.",
    });
  }

  try {
    // Check attendance record
    const { rows: attendanceRows } = await db.query(q.qSelectAttendanceById, [
      Number(id),
    ]);

    if (!attendanceRows.length) {
      return res.status(404).json({
        message: "Registro de presença não encontrado.",
      });
    }

    // Check attendance status
    const { rows: statusRows } = await db.query(q.qSelectAttendanceStatusById, [
      Number(id_attendance_status),
    ]);

    if (!statusRows.length) {
      return res.status(400).json({
        message: "Status de presença não encontrado.",
      });
    }

    // Update attendance
    const { rows } = await db.query(q.qUpdateAttendance, [
      Number(id_attendance_status),
      observation?.trim() || null,
      userId,
      Number(id),
    ]);

    return res.status(200).json({
      message: "Presença atualizada com sucesso.",
      attendance: rows[0],
    });
  } catch (err) {
    console.error(err);

    if (err.code === "23503") {
      return res.status(400).json({
        message: "Uma das referências informadas não existe.",
      });
    }

    return res.status(500).json({
      message: "Erro ao atualizar presença.",
    });
  }
};

// Function to add attendance registry for all active employees, markinig them as present
const markAllPresent = async (req, res) => {
  const { date } = req.body;
  const userId = Number(req.id);

  if (
    !validate.validateDate(date) ||
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    return res.status(400).json({
      message: "Data ou usuário inválido.",
    });
  }

  try {
    // Find the "Presente" status
    const { rows: statusRows } = await db.query(q.qSelectPresentStatus);

    if (!statusRows.length) {
      return res.status(500).json({
        message: "O status 'Presente' não está cadastrado.",
      });
    }

    // Mark active employees as present
    const { rows } = await db.query(q.qMarkAllEmployeesPresent, [date, userId]);

    return res.status(200).json({
      message: "Presença em massa processada com sucesso.",
      date,
      registeredCount: rows.length,
      attendance: rows,
    });
  } catch (err) {
    console.error(err);

    if (err.code === "23503") {
      return res.status(400).json({
        message: "Uma das referências informadas não existe.",
      });
    }

    return res.status(500).json({
      message: "Erro ao registrar presença.",
    });
  }
};

// Exporting attendance functions
module.exports = {
  getAttendance,
  addAttendance,
  updateAttendance,
  markAllPresent,
};
