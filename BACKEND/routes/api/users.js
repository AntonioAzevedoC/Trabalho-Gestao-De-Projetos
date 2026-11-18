const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router
  .route("/")
  .get(verifyRoles([PERMISSIONS_LIST.USER]), usersController.getAllUsers) // Route to get all users from the database
  .put(verifyRoles([PERMISSIONS_LIST.USER]), usersController.updateUser); // Route to update user from database

router
  .route("/:id")
  .get(verifyRoles([PERMISSIONS_LIST.USER]), usersController.getUserByID) // Route to get a specific user from the database
  .put(verifyRoles([PERMISSIONS_LIST.USER]), usersController.deactivateUser) // Route to deactivate user from database
  .delete(verifyRoles([PERMISSIONS_LIST.USER]), usersController.deleteUser); // Route to delete user from database

module.exports = router;
