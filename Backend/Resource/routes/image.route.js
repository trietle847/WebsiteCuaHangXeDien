const express = require("express");
const ImageController = require("../controllers/image.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Image
 *   description: Quản lý hình ảnh sản phẩm
 */

/**
 * @swagger
 * /image/create:
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
 *               data:
 *                 type: string
 *                 example: chuyển sang base64
 *               title:
 *                 type: string
 *                 example: "Ảnh sản phẩm 1"
 *     responses:
 *       200:
 *         description: Tạo ảnh thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 */
router.post("/create", ImageController.createImage);

/**
 * @swagger
 * /image/update/{id}:
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
 *                 example: chuyển sang base64
 *               title:
 *                 type: string
 *                 example: "Ảnh sản phẩm 1 đã cập nhật"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy ảnh
 */
router.put("/update/:id", ImageController.updateImage);

/**
 * @swagger
 * /image/get/all:
 *   get:
 *     summary: Lấy tất cả hình ảnh
 *     tags: [Image]
 *     responses:
 *       200:
 *         description: Danh sách tất cả ảnh
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Image'
 */
router.get("/get/all", ImageController.getAllImage);

/**
 * @swagger
 * /image/get:
 *   get:
 *     summary: Lấy hình ảnh theo ID
 *     tags: [Image]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID hình ảnh cần lấy
 *         example: 1
 *     responses:
 *       200:
 *         description: Trả về thông tin hình ảnh
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 *       404:
 *         description: Không tìm thấy ảnh
 */
router.get("/get", ImageController.getImageById);

/**
 * @swagger
 * /image/delete:
 *   delete:
 *     summary: Xóa hình ảnh theo ID
 *     tags: [Image]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy ảnh
 */
router.delete("/delete", ImageController.deleteImage);

module.exports = router;
