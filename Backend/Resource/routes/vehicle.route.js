const vehicleController = require("../controllers/vehicle.controller");
const express = require("express");
const { authMiddleware, authorizeRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/customer",
  authMiddleware,
  authorizeRoles("user"),
  vehicleController.getVehicleByUser
);

router.get(
  "/customer/:customer_id",
  authMiddleware,
  authorizeRoles("staff", "admin"),
  vehicleController.findVehicleForCustomer
);

module.exports = router;