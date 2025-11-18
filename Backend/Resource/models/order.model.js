const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

// Đơn giản hóa mô hình Order so với mô hình cũ
const OrderModel = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Không cần status vì có thể suy ra từ Payment và Delivery
    totalAmount: { type: DataTypes.INTEGER, allowNull: false },
    note: { type: DataTypes.TEXT, allowNull: true },
    promotion_code: { type: DataTypes.STRING, allowNull: true },
    discount_value: { type: DataTypes.FLOAT, allowNull: true },
    // Thuộc tính ảo - không lưu trong DB, dùng để trả về trạng thái tổng thể của đơn hàng
    overallStatus: {
      type: DataTypes.VIRTUAL,
      get() {
        const payment = this.getDataValue("Payment");
        const delivery = this.getDataValue("Delivery");
        return OrderModel.calculateOverallStatus(
          payment?.status,
          delivery?.status
        );
      },
    },
  },
  {
    // Cần bật timestamps để theo dõi thời gian tạo đơn hàng
    timestamps: true,
    tableName: "order",
  }
);

OrderModel.calculateOverallStatus = function (paymentStatus, deliveryStatus) {
  if (paymentStatus === "failed" || deliveryStatus === "failed") {
    return "Thất bại";
  }

  if (paymentStatus === "completed" && deliveryStatus === "delivered") {
    return "Thành công";
  }

  if (deliveryStatus === "processing") {
    return "Đang xử lý";
  }

  if (deliveryStatus === "shipping") {
    return "Đang giao hàng";
  }

  if (deliveryStatus === "ready") {
    return "Sẵn sàng nhận hàng";
  }

  if (paymentStatus === "pending") {
    return "Chờ thanh toán";
  }

  return "Chờ xử lý";
};

module.exports = OrderModel;
