const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

// Mô hình cũ tồn tại như một bảng tham khảo cho các phương thức giao hàng
// Ý tưởng cho mô hình mới là thể hiện cho thông tin về 1 lần giao hàng cụ thể trong đơn hàng
const DeliveryModel = sequelize.define(
  "Delivery",
  {
    delivery_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    method: {
      type: DataTypes.ENUM("home_delivery", "at_store"),
      allowNull: false,
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Giá vận chuyển được lưu lại chính xác tại thời điểm đặt hàng",
    },
    status: {
      // TH giao tận nơi:
      //   processing: đang xử lý đơn hàng
      //   shipping: đang giao hàng
      //   delivered: đã giao hàng thành công
      //   failed: giao hàng thất bại (khách không nhận, địa chỉ sai...)
      // TH nhận tại cửa hàng:
      //   processing: đang xử lý đơn hàng
      //   ready: hàng đã sẵn sàng để khách đến nhận
      //   delivered: khách đã đến nhận hàng
      type: DataTypes.ENUM("processing", "ready", "shipping", "delivered", "failed"),
      defaultValue: "processing",
      allowNull: false,
    },
    // Thông tin người nhận hàng - phải thêm vào
    // Vì nếu chỉ liên kết với user thì thông tin bị thay đổi khi user cập nhật
    recipient_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipient_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // address cũng tương tự, ngoài ra cũng có thể linh hoạt không cần địa chỉ nếu nhận tại cửa hàng
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Thời gian giao hàng thành công",
    },
    // Ghi chú thêm cho lần giao hàng
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    tableName: "delivery",
    timestamps: true,
  }
);

module.exports = DeliveryModel;
