const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router
  .route("/")
  // .get(verifyRoles([PERMISSIONS_LIST.Admin]), employeesController.getAllUsers) // Route to get all users from the database
  .get(employeesController.getAllEmployees) // Route to get all users from the database
  // .put(verifyRoles([PERMISSIONS_LIST.Admin]), employeesController.updateUser); // Route to update user from database
  .put(employeesController.updateEmployee); // Route to update user from database

router
  .route("/:id")
  // .get(verifyRoles([PERMISSIONS_LIST.Admin]), employeesController.getUserByID) // Route to get a specific user from the database
  .get(employeesController.getEmployeeByID) // Route to get a specific user from the database
  // .put(verifyRoles([PERMISSIONS_LIST.Admin]), employeesController.deactivateUser) // Route to deactivate user from database
  .put(employeesController.deactivateEmployee) // Route to deactivate user from database
  // .delete(verifyRoles([PERMISSIONS_LIST.Admin]), employeesController.deleteUser); // Route to delete user from database
  .delete(employeesController.deleteEmployee); // Route to delete user from database

// router.route("/search/:searchText").get(employeesController.searchForUsers); // Route to search for users in the database;
// .get(verifyRoles([PERMISSIONS_LIST.Admin]), employeesController.searchForUsers); // Route to search for users in the database;

module.exports = router;
