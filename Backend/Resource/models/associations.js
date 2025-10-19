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
const Color = require("../models/color.model");
const ProductColor = require("../models/productColor.model");
const ProductDetail = require("../models/productDetail.model");

// ========================== USER ==========================
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

User.hasMany(Order, 
  { foreignKey: "user_id" }
);

Order.belongsTo(User, 
  { foreignKey: "user_id" }
);

User.hasMany(Feedback, 
  { foreignKey: "user_id" }
);

Feedback.belongsTo(User, 
  { foreignKey: "user_id" }
);

User.hasMany(MaintenanceSchedule, 
  { foreignKey: "user_id" }
);

MaintenanceSchedule.belongsTo(User, 
  { foreignKey: "user_id" }
);

// ========================== PRODUCT ==========================
Product.hasMany(MaintenanceSchedule, 
  { foreignKey: "product_id" }
);

MaintenanceSchedule.belongsTo(Product, 
  { foreignKey: "product_id" }
);

// Product <-> Color: many-to-many (bảng phụ ProductColor)
Product.belongsToMany(Color, {
  through: ProductColor,
  foreignKey: "product_id",
  otherKey: "color_id",
  as: "Colors",
});

Color.belongsToMany(Product, {
  through: ProductColor,
  foreignKey: "color_id",
  otherKey: "product_id",
  as: "Products",
});

// Product <-> ProductColor: one-to-many
Product.hasMany(ProductColor, {
  foreignKey: "product_id",
  as: "ProductColors",
});

ProductColor.belongsTo(Product, {
  foreignKey: "product_id",
  as: "Product",
  onDelete: "CASCADE",
});

// ProductColor <-> Color: many-to-one
ProductColor.belongsTo(Color, {
  foreignKey: "color_id",
  as: "Color",
  onDelete: "CASCADE",
});

// ProductColor <-> Image: one-to-many
ProductColor.hasMany(Image, {
  foreignKey: "productColor_id",
  as: "ColorImages",
});

Image.belongsTo(ProductColor, {
  foreignKey: "productColor_id",
  as: "ProductColor",
  onDelete: "CASCADE",
});

// Product <-> ProductDetail: one-to-one
Product.hasOne(ProductDetail, {
  foreignKey: "product_id",
  as: "ProductDetail",
  onDelete: "CASCADE",
});

ProductDetail.belongsTo(Product, {
  foreignKey: "product_id",
  as: "Product",
});

// Company <-> Product: one-to-many
Company.hasMany(Product, {
  foreignKey: "company_id",
  as: "Products",
});
Product.belongsTo(Company, {
  foreignKey: "company_id",
  as: "Company",
});

// ========================== ORDER ==========================
Product.hasMany(OrderDetail, { foreignKey: "product_id", as: "OrderDetails" });
OrderDetail.belongsTo(Product, { foreignKey: "product_id", as: "Product" });

Order.hasMany(OrderDetail, { foreignKey: "order_id", as: "OrderDetails" });
OrderDetail.belongsTo(Order, { foreignKey: "order_id", as: "Order" });

Delivery.hasMany(Order, { foreignKey: "delivery_id", as: "Orders" });
Order.belongsTo(Delivery, { foreignKey: "delivery_id", as: "Delivery" });

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

// ========================== FAVOURITE ==========================
User.hasOne(Favourite, { 
  foreignKey: "user_id", 
  as: "Favourite" 
});

Favourite.belongsTo(User, { 
  foreignKey: "user_id", 
  as: "User" 
});

Favourite.belongsToMany(Product, {
  through: "favourite_product",
  foreignKey: "favourite_id",
  otherKey: "product_id",
  as: "Products",
});

Product.belongsToMany(Favourite, {
  through: "favourite_product",
  foreignKey: "product_id",
  otherKey: "favourite_id",
  as: "Favourites",
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
  Color,
  ProductColor,
  ProductDetail,
};
