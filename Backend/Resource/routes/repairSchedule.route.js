const RepairScheduleController = require("../controllers/repairSchedule.controller");
const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, RepairScheduleController.createRepairSchedule);
router.get("/", authMiddleware,RepairScheduleController.getRepairSchedule)
router.get("/schedule", RepairScheduleController.getTimeRepair)
module.exports = router;