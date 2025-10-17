const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const ProductColorModel = sequelize.define(
  "ProductColor",
  {
    productColor_id: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true,},
    color_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: false,
    tableName: "product_color",
  }
);

module.exports = ProductColorModel;
