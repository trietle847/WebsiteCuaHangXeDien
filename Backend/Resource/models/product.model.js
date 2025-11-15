const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const ProductModel = sequelize.define(
  "Product",
  {
    product_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    description: {type: DataTypes.TEXT("long"), allowNull: true},
    average_rating: {type: DataTypes.FLOAT, },
    // Chính sách bảo dưỡng và bảo hành của sản phẩm
    // Để tiết kiệm và đơn giản hóa, lưu trữ dưới dạng JSON thay vì tạo bảng riêng
    maintenance_policy: {type: DataTypes.JSON, allowNull: true},
    warranty_policy: {type: DataTypes.JSON, allowNull: true,}, 
  },
  {
    timestamps: true,
    createdAt: false,
    updatedAt: false,
    tableName: "product",
    paranoid: true
  }
);



module.exports = ProductModel;
