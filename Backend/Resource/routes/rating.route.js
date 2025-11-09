const express = require("express");
const ProductController = require("../controllers/product.controller");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const ratingController = require("../controllers/rating.controller");

const router = express.Router();

router.post("/product/:id", authMiddleware, ratingController.create);
router.get("/", ratingController.getAll);

router.get(
  "/check-purchased/:productId",
  authMiddleware,
  ratingController.checkPurchased
);

module.exports = router;

exports = router;
