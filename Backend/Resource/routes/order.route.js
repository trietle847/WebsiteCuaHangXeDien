const express = require("express")
const OrderController = require("../controllers/order.controller")
const {authMiddleware, authorizeRoles} = require("../middlewares/auth.middleware")

const router = express.Router();


router.post("/", authMiddleware, OrderController.createOrder)
router.get("/", authMiddleware, OrderController.getAllOrder);

module.exports = router