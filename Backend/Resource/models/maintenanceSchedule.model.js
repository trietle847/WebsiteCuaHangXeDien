const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const MaintenanceScheduleModel = sequelize.define(
  "Maintenance",
  {
    maintenance_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Giải thích các trạng thái:
    // pending: Lịch bảo dưỡng đã được tạo (do yêu cầu khách hàng hoặc hệ thống) nhưng chưa được xác nhận.
    // confirmed: 2 bên đều đã chốt lịch.
    // inProgress: Đang trong quá trình bảo dưỡng.
    // completed: Bảo dưỡng đã hoàn tất, khách hàng có thể nhận xe.
    // closed: Lịch bảo dưỡng đã được đóng (hoặc là đã thanh toán) sau khi hoàn tất và không có vấn đề gì phát sinh.
    // cancelled: Lịch bảo dưỡng đã bị hủy bỏ trước khi bắt đầu (trước đó có thể là pending hoặc confirmed).
    // expired: Lịch bảo dưỡng đã hết hạn do không được giải quyết trong thời gian quy định, có thể đến từ lỗi CSKH hoặc khách hàng bỏ qua lịch.
    // noShow: Khách hàng không đến đúng hẹn mà không thông báo trước.
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "inProgress",
        "completed",
        "closed",
        "cancelled",
        "expired",
        "noShow"
      ),
      defaultValue: "pending",
    },
    
  },
  {
    timestamps: false,
    tableName: "maintenance",
  }
);

module.exports = MaintenanceScheduleModel;
