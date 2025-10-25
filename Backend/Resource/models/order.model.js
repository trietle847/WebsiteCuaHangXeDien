const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const OrderModel = sequelize.define(
  "Order",
  {
    order_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    payment_status: { type: DataTypes.BOOLEAN,},
    delivery_status: { type: DataTypes.ENUM("confirmed", "shipping","delivered", "failed")},
    totalAmount: {type: DataTypes.INTEGER, allowNull: false}
  },
  {
    timestamps: false,
    tableName: "order",
  }
);

module.exports = OrderModel;
