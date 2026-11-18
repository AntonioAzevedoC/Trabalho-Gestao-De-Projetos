const express = require("express");
const router = express.Router();
const equipmentController = require("../../controllers/equipmentController");
const verifyRoles = require("../../middleware/verifyRoles");
const PERMISSIONS_LIST = require("../../config/rolesPermissionsList");

// Verifying the access token before using the command
router
  .route("/")
  .get(
    verifyRoles([PERMISSIONS_LIST.EQUIPMENT]),
    equipmentController.getAllEquipment,
  ) // Route to get all equipments from database
  .post(
    verifyRoles([PERMISSIONS_LIST.EQUIPMENT]),
    equipmentController.addEquipment,
  ) // Route to add new equipment
  .put(
    verifyRoles([PERMISSIONS_LIST.EQUIPMENT]),
    equipmentController.updateEquipment,
  ); // Route to update equipment from database

router
  .route("/status")
  .put(
    verifyRoles([PERMISSIONS_LIST.EQUIPMENT]),
    equipmentController.updateEquipmentStatus,
  ); // Route to update equipment status

router
  .route("/:id")
  .get(
    verifyRoles([PERMISSIONS_LIST.EQUIPMENT]),
    equipmentController.getEquipmentByID,
  ); // Route to get a specific equipment from the database

module.exports = router;
