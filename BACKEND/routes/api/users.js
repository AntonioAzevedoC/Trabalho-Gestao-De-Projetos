const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router
  .route("/")
  // .put(verifyRoles([PERMISSIONS_LIST.Admin]), usersController.updateUser); // Route to update user from database
  .get(usersController.getAllUsers) // Route to get all users from the database
  .put(usersController.updateUser); // Route to update user from database

router
  .route("/:id")
  .get(usersController.getUserByID) // Route to get a specific user from the database
  .put(usersController.deactivateUser) // Route to deactivate user from database
  .delete(usersController.deleteUser); // Route to delete user from database

router.route("/search/:searchText").get(usersController.searchForUsers); // Route to search for users in the database;

module.exports = router;
