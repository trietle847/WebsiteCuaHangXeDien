const express = require("express");
const productController = require("../controllers/product.controller");
const createBaseRouter = require("./baseRouter");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const {
  upload,
  processUploadedImages,
} = require("../middlewares/upload.middleware");

const productRouter = createBaseRouter(productController, {
  // Thêm upload middleware cho create và update
  create: [
    upload.fields([{ name: "images", maxCount: 10 }]), // Parse multipart form
    processUploadedImages, // Xử lý và gắn URL vào req.body
    // authMiddleware,
    // authorizeRoles("admin", "staff")
  ],
  update: [
    upload.fields([{ name: "images", maxCount: 10 }]),
    processUploadedImages,
    // authMiddleware,
    // authorizeRoles("admin", "staff")
  ],
  // getAll: [authMiddleware, authorizeRoles("admin", "staff")],
  // getOne: [authMiddleware, authorizeRoles("admin", "staff")],
  // remove: [authMiddleware, authorizeRoles("admin", "staff")],
});

module.exports = productRouter;
