const express = require("express");
const CartController = require("../controllers/cart.controller");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  CartController.addItemToCart
);
router.get("/", authMiddleware, CartController.getCart);
router.delete(
  "/:id",
  authMiddleware,
  CartController.deleteItemInCart
);

module.exports = router;
