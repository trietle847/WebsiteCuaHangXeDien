const RepairScheduleController = require("../controllers/repairSchedule.controller");
const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, RepairScheduleController.createRepairSchedule);

module.exports = router;