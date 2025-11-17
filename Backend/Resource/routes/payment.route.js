const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/payment.controller");

router.post("/create/momo/:order_id", PaymentController.createMomoPayment);
router.post("/momo/ipn", PaymentController.handleMomoIPN);

module.exports = router;
