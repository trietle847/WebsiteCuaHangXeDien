const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

const { sequelize } = require("./Resource/utils/db");
const { findUpcomingMaintenances } = require("./Resource/utils/cron-task");

console.log("🚀 Bắt đầu chạy test script...");

// Phải kết nối DB trước khi chạy
sequelize
  .authenticate()
  .then(() => {
    console.log("Kết nối DB thành công. Bắt đầu chạy tác vụ...");
    // Gọi thẳng hàm logic, không cần chờ 8h sáng
    return findUpcomingMaintenances();
  })
  .then(() => {
    console.log("✅ Test script hoàn thành.");
  })
  .catch((err) => {
    console.error("❌ Test thất bại:", err);
  })
  .finally(() => {
    // Đóng kết nối
    sequelize.close();
  });
