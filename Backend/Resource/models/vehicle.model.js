const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

// Ta cần bảng vehicle để lưu mỗi chiếc xe vật lý cụ thể
// Giả sử như người dùng mua nhiều xe cùng một mẫu
// Mỗi xe phải có 1 mã định danh VIN riêng biệt để cả bên bán và mua dễ quản lý => đặc biệt là bảo dưỡng và bảo hành
// Đúng trên thực tế, ta cần phải tạo mỗi Vehicle với đúng số lượng productColor đã nhập
// Nhưng để đơn giản cho mô phỏng, vehicle sẽ được tạo khi có đơn hàng thành công
const VehicleModel = sequelize.define(
  "Vehicle",
  {
    vehicle_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "unique_vin", // Đặt tên index để tránh duplicate
    }, // Vehicle Identification Number - Số khung
    engine_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "unique_engine_number", // Đặt tên index để tránh duplicate
    }, // Số máy
    status: {
      type: DataTypes.ENUM(
        "sold", // Xe đã bán
        "damaged", // Xe bị hỏng, không thể sử dụng được
        "decommissioned" // Xe đã ngừng hoạt động
      ),
      defaultValue: "sold",
    },
    // Snapshot quan trọng -> các chính sách bảo hành, bảo dưỡng dựa trên thời điểm mua xe
    maintenance_policy: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    warranty_policy: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "order",
        key: "order_id",
      },
      index: false,
    },
  },
  {
    timestamps: true,
    tableName: "vehicle",
    paranoid: true,
  }
);

module.exports = VehicleModel;
