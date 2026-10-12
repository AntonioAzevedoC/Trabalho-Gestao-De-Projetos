const express = require("express");
const router = express.Router();
const rolesController = require("../../controllers/rolesController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router
  .route("/")
  .post(rolesController.addRole) // Route to add a new role
  .get(rolesController.getAllRoles) // Route to get all roles from the database
  .put(rolesController.updateRole); // Route to update role from database

router
  .route("/:id")
  .get(rolesController.getRoleByID) // Route to get a specific role from the database
  .delete(rolesController.deleteRole); // Route to delete role from database

module.exports = router;
