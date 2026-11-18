const express = require("express");
const router = express.Router();
const rolesController = require("../../controllers/rolesController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router
  .route("/")
  .post(verifyRoles([PERMISSIONS_LIST.ROLES]), rolesController.addRole) // Route to add a new role
  .get(verifyRoles([PERMISSIONS_LIST.ROLES]), rolesController.getAllRoles) // Route to get all roles from the database
  .put(verifyRoles([PERMISSIONS_LIST.ROLES]), rolesController.updateRole); // Route to update role from database

router
  .route("/:id")
  .get(verifyRoles([PERMISSIONS_LIST.ROLES]), rolesController.getRoleByID) // Route to get a specific role from the database
  .delete(verifyRoles([PERMISSIONS_LIST.ROLES]), rolesController.deleteRole); // Route to delete role from database

module.exports = router;
