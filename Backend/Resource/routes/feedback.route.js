const express = require("express")
const FeedbackController = require("../controllers/feedback.controller")
const {authMiddleware, authorizeRoles} = require("../middlewares/auth.middleware")

const router = express.Router();


router.post("/", authMiddleware, FeedbackController.createComment)

router.get("/", authMiddleware, FeedbackController.getAllComment);

module.exports = router;