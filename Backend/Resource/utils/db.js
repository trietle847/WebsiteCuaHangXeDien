const { Sequelize } = require("sequelize")
const config = require("../configs/index")

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: "mysql",
    logging: false,
  }
)

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log(`Kết nối thành công mySql: ${config.db.database}`);
  } catch (error) {
    console.error("Kết nối MySQL thất bại:", error.message);
    process.exit(1);
  }
}

module.exports = { sequelize, connectDB };
