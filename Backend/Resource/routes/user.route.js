const express = require("express");
const passport = require("passport");
const userController = require("../controllers/user.controller");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API quản lý người dùng
 */

/**
 * @swagger
 * /user:
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
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: 123456
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 */
router.post("/", userController.register);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng (chỉ dành cho nhân viên)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 */
router.get(
  "/",
  // authMiddleware,
  // authorizeRoles("staff"),
  userController.getAllUsers
);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Đăng nhập tài khoản
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
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về token JWT
 */
router.post("/login", userController.login);

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Cập nhật thông tin người dùng hiện tại
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
router.put("/:id", authMiddleware, userController.update);

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 */
router.get("/me", authMiddleware, userController.getUserByUsername);

/**
 * @swagger
 * /user/google:
 *   get:
 *     summary: Đăng nhập bằng Google
 *     tags: [User]
 *     description: Chuyển người dùng đến google để đăng nhập
 *     responses:
 *       302:
 *         description: Chuyển tới trang đăng nhập google
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /user/google/callback:
 *   get:
 *     summary: Google OAuth Callback
 *     tags: [User]
 *     description: Phản hồi từ Google và xử lý đăng nhập.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: Mã xác thực trả về từ Google
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đăng nhập Google thành công
 *       400:
 *         description: Lỗi xác thực Google
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login-fail" }),
  userController.loginGoogleCallback
);

/**
 * @swagger
 * /user/login-fail:
 *   get:
 *     summary: Trang thông báo đăng nhập Google thất bại
 *     tags: [User]
 *     responses:
 *       400:
 *         description: Đăng nhập thất bại
 */
router.get("/login-fail", (req, res) => {
  res.status(400).json({ message: "Đăng nhập Google thất bại" });
});

router.get(
  "/:id",
  // authMiddleware,
  // authorizeRoles("admin"),
  userController.getUserById
);

module.exports = router;
