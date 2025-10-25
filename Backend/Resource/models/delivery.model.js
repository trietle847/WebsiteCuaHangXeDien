const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const DeliveryModel = sequelize.define(
  "Delivery",
  {
    delivery_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    price_delivery: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "delivery",
    timestamps: false,
  }
);

DeliveryModel.afterSync(async () => {
  const defaults = [
    { name: "Giao hàng tận nhà", price_delivery: 100000 },
    { name: "Nhận tại của hàng", price_delivery: 0 },
  ];

  for (const data of defaults) {
    await DeliveryModel.findOrCreate({
      where: { name: data.name },
      defaults: data,
    });
  }
});
module.exports = DeliveryModel;
