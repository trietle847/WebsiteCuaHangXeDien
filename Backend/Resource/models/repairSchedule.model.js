const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const RepairScheduleModel = sequelize.define(
  "RepairSchedule",
  {
    repair_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_id: { type: DataTypes.INTEGER, allowNull: false },
    mechanic_id: { type: DataTypes.INTEGER, allowNull: false },
    repair_date: { type: DataTypes.DATE, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "repairSchedule",
    timestamps: false,
  }
);

module.exports = RepairScheduleModel