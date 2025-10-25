const SearchController = require("../controllers/search.controller");
const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/:entity", authMiddleware, SearchController.search);

module.exports = router;
