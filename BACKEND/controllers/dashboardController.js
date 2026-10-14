// Controller file for dashboard related queries

// Importing database
const db = require("../db");

// Importing queries file
const { queries: q, queries } = require("./queries/queries");

// Importing validation helper functions
const validate = require("../helpers/dataValidation");

// Function to get main data for dashborad
// It works with either a selected date, or the current date as default
const getDashboard = async (req, res) => {
  try {
    const date = req.body || null;

    if (date !== null && !validate.validateDate(date)) {
      return res.status(400).json({
        message: "Invalid date. Use YYYY-MM-DD.",
      });
    }

    const [
      dashboardDate,
      activeEmployees,
      attendance,
      equipmentTotal,
      equipmentByStatus,
      equipmentByType,
    ] = await Promise.all([
      db.query(queries.qDashboardDate, [date]),
      db.query(queries.qDashboardActiveEmployees),
      db.query(queries.qDashboardAttendanceSummary, [date]),
      db.query(queries.qDashboardEquipmentTotal),
      db.query(queries.qDashboardEquipmentByStatus),
      db.query(queries.qDashboardEquipmentByType),
    ]);

    return res.status(200).json({
      date: dashboardDate.rows[0].date,
      employees: {
        active: activeEmployees.rows[0].total_active_employees,
      },
      attendance: attendance.rows[0],
      equipment: {
        total: equipmentTotal.rows[0].total,
        byStatus: equipmentByStatus.rows,
        byType: equipmentByType.rows,
      },
    });
  } catch (error) {
    console.error("Erro ao carregar painél:", error);

    return res.status(500).json({
      message: "Não foi possível encontrar as informações do painél.",
    });
  }
};

// Exporting dashboard functions
module.exports = {
  getDashboard,
};
