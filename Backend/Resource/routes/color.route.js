const ColorController = require("../controllers/color.controller");
const express = require("express");
const router = express.Router();

router.post("/", ColorController.createColor);
router.get("/", ColorController.getAllColor);
router.delete("/", ColorController.deleteColor);

module.exports = router;