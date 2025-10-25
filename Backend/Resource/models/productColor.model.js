const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const ProductColorModel = sequelize.define(
  "ProductColor",
  {
    productColor_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    color_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    stock_quantity: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
  },
  {
    timestamps: false,
    tableName: "product_color",
    paranoid: true
  }
);

module.exports = ProductColorModel;
