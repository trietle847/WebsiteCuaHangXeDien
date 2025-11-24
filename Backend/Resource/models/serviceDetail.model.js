const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const ServiceDetailModel = sequelize.define(
  "ServiceDetail",
  {
    serviceDetail_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
        primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT, // Nội dung chi tiết dịch vụ
      allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2), // Giá của dịch vụ chi tiết
        allowNull: false,   
    },
    note: {
        type: DataTypes.TEXT, // Ghi chú thêm về dịch vụ chi tiết
        allowNull: true,
    }
  },
  {
    timestamps: true,
    tableName: "serviceDetail",
  }
);

module.exports = ServiceDetailModel;