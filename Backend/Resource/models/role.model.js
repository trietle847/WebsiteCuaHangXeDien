const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const RoleModel = sequelize.define(
  "Role",
  {
    role_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: {type: DataTypes.STRING, allowNull: false}
  },
  {
    timestamps: false,
    tableName: "role",
  }
);

module.exports = RoleModel;
