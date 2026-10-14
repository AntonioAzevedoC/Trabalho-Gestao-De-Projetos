const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/dashboardController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router.route("/").get(dashboardController.getDashboard); // Route to get main data for dashboard from database

module.exports = router;
