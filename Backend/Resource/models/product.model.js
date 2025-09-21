const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const ProductModel = sequelize.define(
  "Product",
  {
    product_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    stock_quantity: {type: DataTypes.INTEGER, allowNull: false},
    specifications: {type: DataTypes.INTEGER, allowNull: false},
    average_rating: {type: DataTypes.FLOAT, allowNull: false}, 
  },
  {
    timestamps: false,
    tableName: "product",
  }
);

module.exports = ProductModel;
