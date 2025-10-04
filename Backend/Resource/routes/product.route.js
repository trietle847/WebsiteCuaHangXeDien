const express = require("express");
const productController = require("../controllers/product.controller");
const createBaseRouter = require("./baseRouter");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");

const productRouter = createBaseRouter(productController, {
  // getAll: [authMiddleware, authorizeRoles("admin", "staff")],
  // getOne: [authMiddleware, authorizeRoles("admin", "staff")],
  // create: [authMiddleware, authorizeRoles("admin", "staff")],
  // update: [authMiddleware, authorizeRoles("admin", "staff")],
  // remove: [authMiddleware, authorizeRoles("admin", "staff")],
});

module.exports = productRouter;
