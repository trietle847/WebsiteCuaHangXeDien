const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/payment.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post(
  "/create/momo/:order_id",
  authMiddleware,
  PaymentController.createMomoPayment
);

router.post("/momo/ipn", authMiddleware, PaymentController.handleMomoIPN);

module.exports = router;
