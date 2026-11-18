const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router
  .route("/")
  .get(
    verifyRoles([PERMISSIONS_LIST.EMPLOYEE]),
    employeesController.getAllEmployees,
  ) // Route to get all employees from the database
  .post(
    verifyRoles([PERMISSIONS_LIST.EMPLOYEE]),
    employeesController.addEmployee,
  ) // Route to add new employee
  .put(
    verifyRoles([PERMISSIONS_LIST.EMPLOYEE]),
    employeesController.updateEmployee,
  ); // Route to update employee from database

router
  .route("/:id")
  .get(
    verifyRoles([PERMISSIONS_LIST.EMPLOYEE]),
    employeesController.getEmployeeByID,
  ) // Route to get a specific employee from the database
  .delete(
    verifyRoles([PERMISSIONS_LIST.EMPLOYEE]),
    employeesController.deleteEmployee,
  ); // Route to delete employee from database

router
  .route("/:id/:id_user")
  .put(
    verifyRoles([PERMISSIONS_LIST.EMPLOYEE]),
    employeesController.deactivateEmployee,
  ); // Route to deactivate employee from database

module.exports = router;
