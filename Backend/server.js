require("dotenv").config();
const app = require("./app");
const config = require("./Resource/configs/index");
const { sequelize, connectDB } = require("./Resource/utils/db");

require("./Resource/models/associations");

async function startServer() {
  try {
    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });

    await connectDB();
    console.log(`Kết nối thành công tới MySQL Database: ${config.db.database}`);

    // tạo csdl
    (async () => {
      await sequelize.sync({ alter: true });
    })();

    // gọi cron
    require("./Resource/utils/cron");
    // const schedule = await MaintenanceModel.findOne(); // lấy 1 lịch bảo trì bất kỳ
    // if (schedule) {
    //   console.log("Đang test gửi mail reminder...");
    //   await MaintenanceService.sendReminder(schedule);
    //   console.log("✅ Gửi mail test thành công (nếu config đúng)");
    // } else {
    //   console.log("⚠️ Không tìm thấy lịch bảo trì nào để test");
    // }
  } catch (error) {
    console.log("cannot connect to mysql", error.message);
    process.exit();
  }
}

startServer();
