const express = require("express");
const ProductController = require("../controllers/product.controller");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: API quản lý sản phẩm
 */

/**
 * @swagger
 * /product/:
 *   get:
 *     summary: Lấy toàn bộ sản phẩm
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Danh sách tất cả sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", ProductController.getAllProduct);

/**
 * @swagger
 * /product/search:
 *   get:
 *     summary: Tìm sản phẩm theo tên
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên sản phẩm cần tìm (không phân biệt hoa thường)
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm phù hợp
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/search", ProductController.findProductsByName); // sử dụng query

/**
 * @swagger
 * /product/:
 *   post:
 *     summary: Tạo mới sản phẩm
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock_quantity
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Xe VinFast Evo200"
 *               price:
 *                 type: integer
 *                 example: 19000000
 *               stock_quantity:
 *                 type: integer
 *                 example: 100
 *               specifications:
 *                 type: string
 *                 example: "Quãng đường 200km, tốc độ tối đa 70km/h"
 *               average_rating:
 *                 type: number
 *                 format: float
 *                 example: 4.2
 *     responses:
 *       200:
 *         description: Tạo sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       403:
 *         description: Không có quyền
 */
router.post(
  "/",
  upload.array("images", 10),
  authMiddleware,
  authorizeRoles("admin", "staff"),
  ProductController.create
);

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Xóa sản phẩm
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID sản phẩm cần xóa
 *     responses:
 *       200:
 *         description: Sản phẩm đã được xóa thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       403:
 *         description: Không có quyền
 */
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "staff"),
  ProductController.deleteProduct
);

/**
 * @swagger
 * /product/:id:
 *   get:
 *     summary: Lấy sản phẩm bằng ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID sản phẩm cần lấy
 *     responses:
 *       200:
 *         description: Thông tin sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.get("/:id", ProductController.getProductById);

/**
 * @swagger
 * /product/:id:
 *   put:
 *     summary: Cập nhật sản phẩm
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID sản phẩm cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock_quantity
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Xe VinFast Evo200"
 *               price:
 *                 type: integer
 *                 example: 19000000
 *               stock_quantity:
 *                 type: integer
 *                 example: 100
 *               specifications:
 *                 type: string
 *                 example: "Quãng đường 200km, tốc độ tối đa 70km/h"
 *               average_rating:
 *                 type: number
 *                 format: float
 *                 example: 4.2
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       403:
 *         description: Không có quyền
 */
router.put(
  "/:id",
  upload.array("newImages", 10),
  authMiddleware,
  authorizeRoles("admin", "staff"),
  ProductController.updateProduct
);
module.exports = router;
