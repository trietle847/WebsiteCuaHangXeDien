const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const UserModel = sequelize.define(
  "User",
  {
    user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING(100), allowNull: true }, // Tránh trùng lặp
    password: { type: DataTypes.STRING(100), allowNull: true },
    first_name: { type: DataTypes.STRING(100), allowNull: true },
    last_name: { type: DataTypes.STRING(100), allowNull: true },
    email: { type: DataTypes.STRING(100), allowNull: false }, // Đúng ra nên là unique: true nhưng để tạm vậy cho dễ test
    phone: { type: DataTypes.STRING(100), allowNull: true },
    address: { type: DataTypes.STRING(255), allowNull: true },
    role: {
      type: DataTypes.ENUM(
        "admin",
        "user",
        "mechanic",
        "sale_staff",
        "store_keeper"
      ),
      defaultValue: "user",
    },

    google_id: { type: DataTypes.STRING(100), allowNull: true },
    login_type: {
      type: DataTypes.ENUM("local", "google"),
      defaultValue: "local",
    },

    // Dành cho kích hoạt tài khoản và đặt lại mật khẩu
    status: {
      type: DataTypes.ENUM("active", "inactive", "banned"),
      defaultValue: "active",
    },
    token_hash: { type: DataTypes.STRING(255), allowNull: true },
    token_expires_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "user",
    timestamps: false,
  }
);

module.exports = UserModel;
