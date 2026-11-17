const express = require("express");
const router = express.Router();
const passwordResetController = require("../controllers/passwordResetController");
const verifyRoles = require("../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../config/rolesPermissionsList");

// Verifying the access token before using the command
router
  .route("/")
  .get(passwordResetController.requestPasswordReset) // Route to request password reset
  .put(passwordResetController.resetPassword); // Route to reset password

router.route("/verify/").get(passwordResetController.verifyResetCode); // Route to verify reset code

module.exports = router;
