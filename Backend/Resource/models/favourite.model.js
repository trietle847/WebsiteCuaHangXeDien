const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const FavouriteModel = sequelize.define(
  "Favourite",
  {
    favourite_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
    tableName: "favourite",
  }
);

module.exports = FavouriteModel;