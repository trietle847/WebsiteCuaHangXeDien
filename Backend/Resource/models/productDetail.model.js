const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const ProductDetailModel = sequelize.define(
  "ProductDetail",
  {
    productDetail_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    length: { type: DataTypes.FLOAT},
    width: { type: DataTypes.FLOAT},
    height: { type: DataTypes.FLOAT},
    saddle_height: {type: DataTypes.FLOAT},
    maximum_speed: {type: DataTypes.FLOAT},
    battery: {type: DataTypes.STRING},
    vehicle_engine: {type: DataTypes.STRING},
    charging_time: {type: DataTypes.FLOAT},
    maximum_load: {type: DataTypes.FLOAT},
  },
  {
    timestamps: false,
    tableName: "productDetail",
  }
);

module.exports = ProductDetailModel;
