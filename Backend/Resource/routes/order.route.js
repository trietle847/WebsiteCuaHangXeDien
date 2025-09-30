const express = require("express");
const OrderController = require("../controllers/order.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Quản lý đơn hàng
 */

/**
 * @swagger
 * /order/:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     description: Người dùng tạo đơn hàng với danh sách sản phẩm.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                       example: "1"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo đơn hàng thành công"
 *                 order:
 *                   type: object
 *                 orderDetails:
 *                   type: array
 *       500:
 *         description: Lỗi server
 */
router.post("/", authMiddleware, OrderController.createOrder);

/**
 * @swagger
 * /order/:
 *   get:
 *     summary: Lấy danh sách đơn hàng
 *     description: Người dùng thường chỉ thấy đơn hàng của họ. Admin hoặc staff sẽ thấy tất cả đơn hàng.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Lỗi server
 */
router.get("/", authMiddleware, OrderController.getAllOrder);

module.exports = router;
