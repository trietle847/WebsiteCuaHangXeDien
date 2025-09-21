const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const UserModel = sequelize.define(
  "User",
  {
    user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING(100), allowNull: false },
    password: { type: DataTypes.STRING(100), allowNull: false },
    first_name: { type: DataTypes.STRING(100), allowNull: false },
    last_name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false },
    phone: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    tableName: "user",
    timestamps: false,
  }
);

module.exports = UserModel;
