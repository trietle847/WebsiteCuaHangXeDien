const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const OrderDetail = sequelize.define(
  "OrderDetail",
  {
    orderDetail_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: false,
    tableName: "orderDetail",
  }
);

module.exports = OrderDetail;
