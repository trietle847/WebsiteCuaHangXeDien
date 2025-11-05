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
    mechanic_id: { type: DataTypes.INTEGER,},
    repair_date: { type: DataTypes.DATEONLY, allowNull: false },
    repair_time: { type: DataTypes.TIME, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "repairSchedule",
    timestamps: false,
  }
);

module.exports = RepairScheduleModel;
