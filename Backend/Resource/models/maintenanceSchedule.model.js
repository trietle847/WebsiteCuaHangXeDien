const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const MaintenanceScheduleModel = sequelize.define(
  "Maintenance",
  {
    maintenance_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    status: { type: DataTypes.ENUM("pending", "confirmed", "missed"), defaultValue: "pending"},
    day_of_month: {type: DataTypes.INTEGER, allowNull: false},
    interval_months: {type: DataTypes.INTEGER, allowNull: false},
  },
  {
    timestamps: false,
    tableName: "maintenance",
  }
);

module.exports = MaintenanceScheduleModel;
