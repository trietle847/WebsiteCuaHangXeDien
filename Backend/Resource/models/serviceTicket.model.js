const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

// Sửa đổi tên model từ MaintenanceSchedule thành ServiceTicket
// sử dụng 1 mẫu tên chung cho các vé dịch vụ bảo trì
const ServiceTicketModel = sequelize.define(
  "ServiceTicket",
  {
    serviceTicket_id: {
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
    type: {
      type: DataTypes.ENUM("maintenance", "repair", "warranty"), // Loại dịch vụ: bảo dưỡng định kỳ, sửa chữa hoặc bảo hành
      allowNull: false,
    },
    expected_date: {
      type: DataTypes.DATEONLY, // Ngày dự kiến (phần lớn là cho trường hợp bảo dưỡng định kỳ)
      allowNull: true,
    },
    confirmed_date_time: {
      type: DataTypes.DATE, // Ngày đã được xác nhận 
      allowNull: true,
    },
    check_in_time: {
      type: DataTypes.DATE, // Thời gian khách hàng đến
      allowNull: true,
    },
    completed_time: {
      type: DataTypes.DATE, // Thời gian hoàn tất dịch vụ
      allowNull: true,
    },
    closed_time: {
      type: DataTypes.DATE, // Thời gian đóng lịch
      allowNull: true,    
    },
    mileage_at_check_in: {
      type: DataTypes.INTEGER, // Số km tại thời điểm khách hàng đến
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT, // Mô tả vấn đề hoặc yêu cầu từ khách hàng
      allowNull: true,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2), // Tổng chi phí dịch vụ
      allowNull: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "user_id",
      }
    },
    mechanic_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "user",
        key: "user_id",
      }
    },
  },
  {
    timestamps: true,
    tableName: "serviceTicket",
  }
);

module.exports = ServiceTicketModel;
