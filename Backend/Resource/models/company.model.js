const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

// const default_maintenance_policy = [
//   {
//     interval_months: 3,
//     task: "Kiểm tra hệ thống phanh",
//   },
//   {
//     interval_months: 6,
//     task: "Kiểm tra toàn bộ hệ thống điện và thay lọc gió",
//   },
//   {
//     interval_months: 12,
//     task: "Thay dầu phanh và kiểm tra hệ thống treo",
//   }
// ]

// const default_warranty_policy = [
//   {
//     category: "Pin",
//     duration_months: 24,
//     details: "Bảo hành thay mới nếu pin gặp sự cố do lỗi nhà sản xuất trong vòng 24 tháng.",
//   },
//   {
//     category: "Động cơ điện",
//     duration_months: 36,
//     details: "Bảo hành sửa chữa miễn phí các lỗi kỹ thuật liên quan đến động cơ điện trong vòng 36 tháng.",
//   },
// ];

const CompanyModel = sequelize.define(
  "Company",
  {
    company_id: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true,},
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false},
    // Chính sách bảo dưỡng và bảo hành chung của hãng nếu product không có chính sách riêng
    maintenance_policy: { type: DataTypes.JSON, allowNull: true, defaultValue: null },
    warranty_policy: { type: DataTypes.JSON, allowNull: true, defaultValue: null },
  },
  {
    tableName: "company",
    timestamps: false,
    paranoid: true
  }
);

module.exports = CompanyModel;
