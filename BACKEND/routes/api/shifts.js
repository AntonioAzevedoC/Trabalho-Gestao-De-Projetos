const express = require("express");
const router = express.Router();
const shiftsController = require("../../controllers/shiftsController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router
  .route("/")
  .get(shiftsController.getAllShifts) // Route to get all shifts from the database
  .post(shiftsController.addShift) // Route to add new shift
  .put(shiftsController.updateShift); // Route to update shift

router.route("/:id").delete(shiftsController.deleteShift); // Route to delete shift from database

module.exports = router;
