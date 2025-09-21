const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const PromotionModel = sequelize.define(
  "Promotion",
  {
    promotion_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    content: { type: DataTypes.STRING, allowNull: false },
    promotional_percentage: {type: DataTypes.INTEGER, allowNull: false},
    start_date: {type: DataTypes.DATE, allowNull: false},
    end_date: {type: DataTypes.DATE, allowNull: false}
  },
  {
    tableName: "promotion",
    timestamps: false,
  }
);

module.exports = PromotionModel;
