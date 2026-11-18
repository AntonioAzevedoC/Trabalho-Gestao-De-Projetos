const express = require("express");
const router = express.Router();
const attendanceController = require("../../controllers/attendanceController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router
  .route("/")
  .get(
    verifyRoles([PERMISSIONS_LIST.ATTENDANCE]),
    attendanceController.getAttendance,
  ) // Route to get all attendances from database
  .post(
    verifyRoles([PERMISSIONS_LIST.ATTENDANCE]),
    attendanceController.addAttendance,
  ) // Route to add new attendance
  .put(
    verifyRoles([PERMISSIONS_LIST.ATTENDANCE]),
    attendanceController.updateAttendance,
  ); // Route to update attendance

router
  .route("/all/")
  .post(
    verifyRoles([PERMISSIONS_LIST.ATTENDANCE]),
    attendanceController.markAllPresent,
  ); // Route to get a specific attendance from the database

module.exports = router;
