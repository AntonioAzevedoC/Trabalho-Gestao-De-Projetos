const express = require("express");
const router = express.Router();
const equipmentController = require("../../controllers/equipmentController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router
  .route("/")
  .get(equipmentController.getAllEquipment) // Route to get all equipments from database
  .post(equipmentController.addEquipment) // Route to add new equipment
  .put(equipmentController.updateEquipment); // Route to update equipment from database

router.route("/status").put(equipmentController.updateEquipmentStatus); // Route to update equipment status

router.route("/:id").get(equipmentController.getEquipmentByID); // Route to get a specific equipment from the database

module.exports = router;
