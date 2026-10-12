const express = require("express");
const router = express.Router();
const permissionsController = require("../../controllers/permissionsController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router.route("/").get(permissionsController.getAllPermissions); // Route to get all permissions

router
  .route("/:id_role/:id_permission")
  .put(permissionsController.addPermissionToRole) // Route to add a permission to a role
  .delete(permissionsController.deletePermissionFromRole); // Route to remove permission from role

router.route("/:id_role").get(permissionsController.getPermissionsByRoleID); // Route to get all permissions related to a role

module.exports = router;
