const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const ImageModel = sequelize.define(
  "Image",
  {
    image_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "image",
    timestamps: false,
  }
);

module.exports = ImageModel;
