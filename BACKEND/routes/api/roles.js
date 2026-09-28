const express = require("express");
const router = express.Router();
const rolesController = require("../../controllers/rolesController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router
  .route("/")
  // .get(verifyRoles([PERMISSIONS_LIST.Admin]), rolesController.getAllUsers) // Route to get all users from the database
  .get(rolesController.getAllRoles) // Route to get all users from the database
  // .put(verifyRoles([PERMISSIONS_LIST.Admin]), rolesController.updateUser); // Route to update user from database
  .put(rolesController.updateRole); // Route to update user from database

router
  .route("/:id")
  // .get(verifyRoles([PERMISSIONS_LIST.Admin]), rolesController.getUserByID) // Route to get a specific user from the database
  .get(rolesController.getRoleByID) // Route to get a specific user from the database
  // .put(verifyRoles([PERMISSIONS_LIST.Admin]), rolesController.deactivateUser) // Route to deactivate user from database
  .delete(rolesController.deleteRole); // Route to delete user from database

module.exports = router;
