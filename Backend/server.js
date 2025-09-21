require("dotenv").config();

const app = require("./app");
const config = require("./Resource/configs/index");
const { sequelize, connectDB } = require("./Resource/utils/db");
const UserService = require("./Resource/services/user.service");

const { User, Role, Order } = require("./Resource/models/associations");

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
  
  } catch (error) {
    console.log("cannot connect to mysql", error.message);
    process.exit();
  }
}

startServer();
