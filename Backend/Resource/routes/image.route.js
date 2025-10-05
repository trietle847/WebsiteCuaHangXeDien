const express = require("express");
const ImageController = require("../controllers/image.controller");
const upload = require("../middlewares/upload.middleware")
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Image
 *   description: Quản lý hình ảnh sản phẩm
 */

/**
 * @swagger
 * /image:
 *   post:
 *     summary: Tạo mới hình ảnh
 *     tags: [Image]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: file
 *               title:
 *                 type: string
 *                 example: "Ảnh sản phẩm 1"
 *     responses:
 *       201:
 *         description: Tạo ảnh thành công
 */
router.post("/", ImageController.createImage);

/**
 * @swagger
 * /image/{id}:
 *   put:
 *     summary: Cập nhật thông tin hình ảnh
 *     tags: [Image]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID hình ảnh cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 example: "chuyển sang base64"
 *               title:
 *                 type: string
 *                 example: "Ảnh sản phẩm 1 đã cập nhật"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/:id", ImageController.updateImage);

/**
 * @swagger
 * /image:
 *   get:
 *     summary: Lấy tất cả hình ảnh
 *     tags: [Image]
 *     responses:
 *       200:
 *         description: Danh sách tất cả ảnh
 */
router.get("/", ImageController.getAllImage);

/**
 * @swagger
 * /image/{id}:
 *   get:
 *     summary: Lấy hình ảnh theo ID của sản phẩm
 *     tags: [Image]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID hình ảnh cần lấy
 *     responses:
 *       200:
 *         description: Trả về thông tin hình ảnh
 *       404:
 *         description: Không tìm thấy ảnh
 */
router.get("/:id", ImageController.getImageById);

/**
 * @swagger
 * /image/{id}:
 *   delete:
 *     summary: Xóa hình ảnh theo ID
 *     tags: [Image]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy ảnh
 */
router.delete("/:id", ImageController.deleteImage);

module.exports = router;
