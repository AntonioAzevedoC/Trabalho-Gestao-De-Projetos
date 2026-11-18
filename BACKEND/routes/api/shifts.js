const express = require("express");
const router = express.Router();
const shiftsController = require("../../controllers/shiftsController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router
  .route("/")
  .get(verifyRoles([PERMISSIONS_LIST.SHIFTS]), shiftsController.getAllShifts) // Route to get all shifts from the database
  .post(verifyRoles([PERMISSIONS_LIST.SHIFTS]), shiftsController.addShift) // Route to add new shift
  .put(verifyRoles([PERMISSIONS_LIST.SHIFTS]), shiftsController.updateShift); // Route to update shift

router
  .route("/:id")
  .delete(verifyRoles([PERMISSIONS_LIST.SHIFTS]), shiftsController.deleteShift); // Route to delete shift from database

module.exports = router;
