const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/userRolesList");

// Verifying the access token before using the command
router
  .route("/")
  // .get(verifyRoles([ROLES_LIST.Admin]), usersController.getAllUsers) // Route to get all users from the database
  .get(usersController.getAllUsers) // Route to get all users from the database
  // .put(verifyRoles([ROLES_LIST.Admin]), usersController.updateUser); // Route to update user from database
  .put(usersController.updateUser); // Route to update user from database

router
  .route("/:id")
  // .get(verifyRoles([ROLES_LIST.Admin]), usersController.getUserByID) // Route to get a specific user from the database
  .get(usersController.getUserByID) // Route to get a specific user from the database
  // .put(verifyRoles([ROLES_LIST.Admin]), usersController.deactivateUser) // Route to deactivate user from database
  .put(usersController.deactivateUser) // Route to deactivate user from database
  // .delete(verifyRoles([ROLES_LIST.Admin]), usersController.deleteUser); // Route to delete user from database
  .delete(usersController.deleteUser); // Route to delete user from database

router.route("/search/:searchText").get(usersController.searchForUsers); // Route to search for users in the database;
// .get(verifyRoles([ROLES_LIST.Admin]), usersController.searchForUsers); // Route to search for users in the database;

module.exports = router;
