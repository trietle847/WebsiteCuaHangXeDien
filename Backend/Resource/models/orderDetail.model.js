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
    price: { type: DataTypes.INTEGER, allowNull: false },
    total_price: { type: DataTypes.INTEGER, allowNull: false },
    // Snapshot tên sản phẩm và màu tại thời điểm đặt hàng
    product_name: { type: DataTypes.STRING, allowNull: false },
    color_name: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: false,
    tableName: "orderDetail",
  }
);

module.exports = OrderDetail;
