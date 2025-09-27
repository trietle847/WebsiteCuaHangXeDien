const express = require("express")
const MaintenanceController = require("../controllers/maintenance.controller")
const {authMiddleware, authorizeRoles} = require("../middlewares/auth.middleware")

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Maintenance
 *   description: Quản lý lịch bảo trì
 */

/**
 * @swagger
 * /maintenance/admin/create:
 *   post:
 *     summary: Tạo lịch bảo trì định kỳ
 *     description: Chỉ nhân viên (staff) hoặc admin mới có quyền tạo lịch bảo trì. Cần token JWT trong header Authorization.
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []  # định nghĩa trong swagger config
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - day_of_month
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 5
 *               day_of_month:
 *                 type: integer
 *                 description: Ngày trong tháng (1-31) để bảo trì
 *                 example: 15
 *               interval_month:
 *                 type: integer
 *                 description: Chu kỳ bảo trì theo tháng (1 = hàng tháng, 3 = hàng quý, v.v.)
 *                 example: 3
 *     responses:
 *       200:
 *         description: Tạo lịch bảo trì thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo lịch bảo trì thành công"
 *                 schedule:
 *                   type: object
 *                   properties:
 *                     schedule_id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 5
 *                     day_of_month:
 *                       type: integer
 *                       example: 15
 *                     interval_month:
 *                       type: integer
 *                       example: 3
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     status:
 *                       type: ENUM
 *                       example: "pending"
 *       401:
 *         description: Thiếu hoặc không có token
 *       403:
 *         description: Không có quyền truy cập
 */

router.post("/admin/create", authMiddleware, authorizeRoles("staff"), MaintenanceController.createMaintenance)

module.exports = router