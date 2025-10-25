const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const CartItemModel = sequelize.define(
  "CartItem",
  {
    cartItem_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
    tableName: "cartItem",
  }
);

module.exports = CartItemModel;
