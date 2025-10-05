const User = require("../models/user.model");
const Role = require("../models/role.model");
const Order = require("../models/order.model");
const Feedback = require("../models/feedback.model");
const Product = require("../models/product.model");
const Image = require("../models/image.model");
const MaintenanceSchedule = require("../models/maintenanceSchedule.model");
const Company = require("../models/company.model");
const OrderDetail = require("../models/orderDetail.model");
const Delivery = require("../models/delivery.model");
const Promotion = require("../models/promotion.model");
const Favourite = require("../models/favourite.model");

// User <-> Role: Many-to-Many
User.belongsToMany(Role, {
  through: "user_role",
  foreignKey: "user_id",
  otherKey: "role_id",
});

Role.belongsToMany(User, {
  through: "user_role",
  foreignKey: "role_id",
  otherKey: "user_id",
});

// User <-> Order: One-to-Many
User.hasMany(Order, {
  foreignKey: "user_id",
  as: "orders",
});

Order.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// User <-> feedback: One-to-many
User.hasMany(Feedback, {
  foreignKey: "user_id",
  as: "feedbacks",
});

Feedback.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// User <-> schedule: One-to-many
User.hasMany(MaintenanceSchedule, {
  foreignKey: "user_id",
  as: "schedules",
});

MaintenanceSchedule.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Product <-> Schedule: one-to-many

Product.hasMany(MaintenanceSchedule, {
  foreignKey: "product_id",
  as: "schedules",
});

MaintenanceSchedule.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});
// Company <-> Product: one-to-many
Company.hasMany(Product, {
  foreignKey: "company_id",
  as: "products",
});

Product.belongsTo(Company, {
  foreignKey: "company_id",
  as: "company",
});

// Product <-> Image: one-to-many
Product.hasMany(Image, {
  foreignKey: "product_id",
  as: "images",
  onDelete: "CASCADE",
});

Image.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

// Product <-> OrderDetail: one-to-many
Product.hasMany(OrderDetail, {
  foreignKey: "product_id",
  as: "orderDetails",
});

OrderDetail.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

// Order <-> OrtherDetail: one-to-manny
Order.hasMany(OrderDetail, {
  foreignKey: "order_id",
  as: "orderDetails",
});

OrderDetail.belongsTo(Order, {
  foreignKey: "order_id",
  as: "order",
});

// Delivery <-> Order: one-to-many
Delivery.hasMany(Order, {
  foreignKey: "delivery_id",
  as: "orders",
});

Order.belongsTo(Delivery, {
  foreignKey: "delivery_id",
  as: "delivery",
});

// Promotion <-> Order: many-to-many
Promotion.belongsToMany(Order, {
  through: "promotion_order",
  foreignKey: "promotion_id",
  otherKey: "order_id",
});

Order.belongsToMany(Promotion, {
  through: "promotion_order",
  foreignKey: "order_id",
  otherKey: "promotion_id",
});

// User <-> Favourite: one-to-one
User.hasOne(Favourite, {
  foreignKey: "user_id",
});

Favourite.belongsTo(User, {
  foreignKey: "user_id",
});

// Favourite <-> Product: many-to-many
Favourite.belongsToMany(Product, {
  through: "favourite_product",
  foreignKey: "favourite_id",
  otherKey: "product_id",
});

Product.belongsToMany(Favourite, {
  through: "favourite_product",
  foreignKey: "product_id",
  otherKey: "favourite_id",
});

module.exports = {
  User,
  Role,
  Order,
  Feedback,
  Product,
  Image,
  MaintenanceSchedule,
  Company,
  OrderDetail,
  Delivery,
  Promotion,
  Favourite,
  Company
};
