const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const UserModel = sequelize.define(
  "User",
  {
    user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING(100), allowNull: true },
    password: { type: DataTypes.STRING(100), allowNull: true },
    first_name: { type: DataTypes.STRING(100), allowNull: true },
    last_name: { type: DataTypes.STRING(100), allowNull: true },
    email: { type: DataTypes.STRING(100), allowNull: false },
    phone: { type: DataTypes.STRING(100), allowNull: true },

    google_id: { type: DataTypes.STRING(100), allowNull: true},
    login_type: {type: DataTypes.ENUM("local", "google"), defaultValue: "local"}
  },
  {
    tableName: "user",
    timestamps: false,
  }
);

module.exports = UserModel;
