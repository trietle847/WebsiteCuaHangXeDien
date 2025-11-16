const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

// Payment model phải thể hiện thông tin về phương thức thanh toán
const PaymentModel = sequelize.define(
  "Payment",
  {
    payment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    method: { type: DataTypes.ENUM("cash", "bank_transfer"), allowNull: false },
    // pending là chờ thanh toán (áp dụng cho ship cod)
    status: DataTypes.ENUM("pending", "processing", "completed", "failed"),
    paid_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    timestamps: true,
    tableName: "payment",
  }
);

module.exports = PaymentModel;
