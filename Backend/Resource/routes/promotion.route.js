const express = require("express");
const PromotionController = require("../controllers/promotion.controller");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Promotion
 *   description: Quản lý khuyến mãi (chỉ dành cho staff và admin)
 */

/**
 * @swagger
 * /promotion/admin/create:
 *   post:
 *     summary: Tạo mới khuyến mãi
 *     tags: [Promotion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Giảm giá mùa hè"
 *               code:
 *                 type: string
 *                 example: "SUMMER2025"
 *               content:
 *                 type: string
 *                 example: "Khuyến mãi hè giảm 20% cho tất cả sản phẩm"
 *               promotional_percentage:
 *                 type: integer
 *                 example: 20
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-01T00:00:00.000Z"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-30T23:59:59.000Z"
 *     responses:
 *       200:
 *         description: Tạo khuyến mãi thành công
 *       401:
 *         description: Không có quyền truy cập
 */
router.post(
  "/admin/create",
  authMiddleware,
  authorizeRoles("staff", "admin"),
  PromotionController.createPromotion
);

/**
 * @swagger
 * /promotion/admin/update:
 *   put:
 *     summary: Cập nhật khuyến mãi
 *     tags: [Promotion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               promotion_id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Giảm giá cuối năm"
 *               code:
 *                 type: string
 *                 example: "YEAR2025"
 *               content:
 *                 type: string
 *                 example: "Khuyến mãi cuối năm giảm 15%"
 *               promotional_percentage:
 *                 type: integer
 *                 example: 15
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-01T00:00:00.000Z"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T23:59:59.000Z"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy khuyến mãi
 */
router.put(
  "/admin/update",
  authMiddleware,
  authorizeRoles("staff", "admin"),
  PromotionController.updatePromotion
);

/**
 * @swagger
 * /promotion/admin/delete:
 *   delete:
 *     summary: Xóa khuyến mãi
 *     tags: [Promotion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               promotion_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy khuyến mãi
 */
router.delete(
  "/admin/delete",
  authMiddleware,
  authorizeRoles("staff", "admin"),
  PromotionController.deletePromotion
);

/**
 * @swagger
 * /promotion/search:
 *   get:
 *     summary: Tìm kiếm khuyến mãi theo code hoặc tên
 *     tags: [Promotion]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Từ khóa cần tìm (code hoặc name)
 *         example: "SUMMER2025"
 *     responses:
 *       200:
 *         description: Danh sách khuyến mãi phù hợp
 *       404:
 *         description: Không tìm thấy khuyến mãi
 */
router.get("/search", PromotionController.findPromotion);

module.exports = router;
