const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const FeedbackModel = sequelize.define(
  "Feedback",
  {
    feedback_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    content: { type: DataTypes.TEXT("medium") },
    reply: { type: DataTypes.INTEGER.UNSIGNED },
    // date: {type: DataTypes.DATE}
  },
  {
    tableName: "feedback",
    // timestamps: false,
  }
);

module.exports = FeedbackModel;
