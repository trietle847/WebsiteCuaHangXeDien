const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const RatingModel = sequelize.define(
  "Rating",
  {
    rating_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderDetail_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1, max: 5 },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "rating",
    timestamps: false,
  }
);

module.exports = RatingModel;
