const express = require("express");
const router = express.Router();
const refreshUserController = require("../controllers/refreshUserController");

router.get("/", refreshUserController.handleRefreshUser);

module.exports = router;
