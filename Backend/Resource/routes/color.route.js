const ColorController = require("../controllers/color.controller");
const express = require("express");
const router = express.Router();
const { authMiddleware, authorizeRoles } = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, authorizeRoles("staff"), ColorController.createColor);
router.get("/", ColorController.getAllColor);
router.delete("/:id", authMiddleware, authorizeRoles("staff"), ColorController.deleteColor);
module.exports = router;