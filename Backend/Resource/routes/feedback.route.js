const express = require("express");
const FeedbackController = require("../controllers/feedback.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: API quản lý bình luận/feedback
 */

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Tạo mới comment
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Sản phẩm này rất tốt!"
 *               reply:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       200:
 *         description: Tạo comment thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo comment thành công"
 *                 comment:
 *                   type: object
 *                   properties:
 *                     feedback_id:
 *                       type: integer
 *                       example: 1
 *                     content:
 *                       type: string
 *                       example: "Sản phẩm này rất tốt!"
 *                     reply:
 *                       type: integer
 *                       example: 0
 *                     user_id:
 *                       type: integer
 *                       example: 123
 */
router.post("/", authMiddleware, FeedbackController.createComment);

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Lấy danh sách tất cả comment
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy tất cả comment thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "lấy tất cả comment thành công"
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       feedback_id:
 *                         type: integer
 *                         example: 1
 *                       content:
 *                         type: string
 *                         example: "Sản phẩm này rất tốt!"
 *                       reply:
 *                         type: integer
 *                         example: 0
 *                       user_id:
 *                         type: integer
 *                         example: 123
 */
router.get("/", authMiddleware, FeedbackController.getAllComment);

module.exports = router;
