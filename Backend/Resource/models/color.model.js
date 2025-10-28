const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const ColorModel = sequelize.define(
  "Color",
  {
    color_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING },
    code: { type: DataTypes.STRING },
  },
  {
    timestamps: true,
    createdAt: false,
    updatedAt: false,
    tableName: "color",
    paranoid: true,
  }
);

module.exports = ColorModel;
