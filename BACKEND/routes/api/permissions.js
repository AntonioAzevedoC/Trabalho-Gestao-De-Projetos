const express = require("express");
const router = express.Router();
const permissionsController = require("../../controllers/permissionsController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router
  .route("/")
  // .get(verifyRoles([PERMISSIONS_LIST.Admin]), permissionsController.getAllUsers) // Route to get all users from the database
  .get(permissionsController.getAllPermissions); // Route to get all users from the database
// .put(verifyRoles([PERMISSIONS_LIST.Admin]), permissionsController.updateUser); // Route to update user from database

router
  .route("/:id_role/:id_permission")
  // .get(verifyRoles([PERMISSIONS_LIST.Admin]), permissionsController.getUserByID) // Route to get a specific user from the database
  .put(permissionsController.addPermissionFromRole) // Route to get a specific user from the database
  // .put(verifyRoles([PERMISSIONS_LIST.Admin]), permissionsController.deactivateUser) // Route to deactivate user from database
  .delete(permissionsController.deletePermissionFromRole); // Route to delete user from database

router
  .route("/:id_role")
  // .get(verifyRoles([PERMISSIONS_LIST.Admin]), permissionsController.getPermissionsByRoleID) // Route to get a specific user from the database
  .get(permissionsController.getPermissionsByRoleID); // Route to get a specific user from the database

module.exports = router;
