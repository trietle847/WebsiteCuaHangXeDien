const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const ScheduleModel = sequelize.define(
  "Schedule",
  {
    schedule_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false},
    status: {type: DataTypes.BOOLEAN}
  },
  {
    timestamps: false,
    tableName: "schedule",
  }
);

module.exports = ScheduleModel;
