const express = require("express");
const userController = require("../controllers/user.controller");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");

const router = express.Router();
/**
 * @swagger
 * /user/:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 */
router.post("/", userController.register);

/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Lấy danh sách user (chỉ staff mới được xem)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách user
 */
router.get(
  "/",
  authMiddleware,
  authorizeRoles("staff"),
  userController.getAllUsers
);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về token
 */
router.post("/login", userController.login);

/**
 * @swagger
 * /user/:
 *   put:
 *     summary: Cập nhật thông tin user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/", authMiddleware, userController.update);

module.exports = router;
