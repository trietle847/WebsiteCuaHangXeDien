const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const CartModel = sequelize.define(
  "Cart",
  {
    cart_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
    tableName: "cart",
  }
);

module.exports = CartModel;