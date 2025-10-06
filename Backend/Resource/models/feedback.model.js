const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const FeedbackModel = sequelize.define(
  "Feedback",
  {
    feedback_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    content: {type: DataTypes.TEXT("long")},
    reply: {type: DataTypes.INTEGER}, 
    // date: {type: DataTypes.DATE}
  },
  {
    tableName: "feedback",
    // timestamps: false,
  }
);

module.exports = FeedbackModel;
