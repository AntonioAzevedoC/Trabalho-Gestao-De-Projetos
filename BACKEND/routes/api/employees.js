const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router
  .route("/")
  .get(employeesController.getAllEmployees) // Route to get all employees from the database
  .post(employeesController.addEmployee) // Route to add new employee
  .put(employeesController.updateEmployee); // Route to update employee from database

router
  .route("/:id")
  .get(employeesController.getEmployeeByID) // Route to get a specific employee from the database
  .delete(employeesController.deleteEmployee); // Route to delete employee from database

router.route("/:id/:id_employee").put(employeesController.deactivateEmployee); // Route to deactivate employee from database

module.exports = router;
