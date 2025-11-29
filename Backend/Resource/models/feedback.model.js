const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const FeedbackModel = sequelize.define(
  "Feedback",
  {
    feedback_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: { type: DataTypes.TEXT("long") },
    reply: { type: DataTypes.INTEGER },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // mặc định hiển thị
    },
    // date: {type: DataTypes.DATE}
  },
  {
    tableName: "feedback",
    // timestamps: false,
    timestamps: false, // ✅ thêm dòng này
  }
);

module.exports = FeedbackModel;
