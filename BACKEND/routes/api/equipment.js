const express = require("express");
const router = express.Router();
const equipmentsController = require("../../controllers/equipmentsController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router
  .route("/")
  .get(equipmentsController.getAllEquipment) // Route to get all equipments from database
  .post(equipmentsController.addEquipment) // Route to add new equipment
  .put(equipmentsController.updateEquipment); // Route to update equipment from database

router.route("/status").put(equipmentsController.updateEquipmentStatus); // Route to update equipment status

router.route("/:id").get(equipmentsController.getEquipmentByID); // Route to get a specific equipment from the database

module.exports = router;
