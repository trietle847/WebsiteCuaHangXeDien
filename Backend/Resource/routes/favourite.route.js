const express = require("express");
const FavouriteController = require("../controllers/favourite.controller");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Favourite
 *   description: Quản lý sản phẩm yêu thích của người dùng
 */

/**
 * @swagger
 * /favourite/:
 *   post:
 *     summary: Thêm sản phẩm vào danh sách yêu thích
 *     tags: [Favourite]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Thêm sản phẩm vào danh sách yêu thích thành công
 *       400:
 *         description: Chưa có token
 */
router.post(
  "/",
  authMiddleware,
  FavouriteController.addProductToFavourite
);

/**
 * @swagger
 * /favourite/:
 *   get:
 *     summary: Lấy danh sách sản phẩm yêu thích
 *     tags: [Favourite]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm yêu thích
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   productId:
 *                     type: integer
 *                     example: 5
 *                   userId:
 *                     type: integer
 *                     example: 2
 *       400:
 *         description: Chưa có token
 */
router.get("/", authMiddleware, FavouriteController.getFavouriteProduct);

/**
 * @swagger
 * /favourite/:
 *   delete:
 *     summary: Xóa sản phẩm khỏi danh sách yêu thích
 *     tags: [Favourite]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Xóa sản phẩm khỏi danh sách yêu thích thành công
 *       400:
 *         description: Chưa có token
 */
router.delete(
  "/",
  authMiddleware,
  FavouriteController.deleteProductInFavourite
);

module.exports = router;
