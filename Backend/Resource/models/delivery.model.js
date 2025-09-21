const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const Delivery = sequelize.define(
  "Delivery",
  {
    delivery_id: {type: DataTypes.INTEGER,autoIncrement: true,  primaryKey: true,},
    name: { type: DataTypes.INTEGER, allowNull: false },
    detail: { type: DataTypes.STRING },
    cost: {type: DataTypes.INTEGER, allowNull: false}
  },
  {
    tableName: "delivery",
    timestamps: false,
  }
);

module.exports = Delivery;
