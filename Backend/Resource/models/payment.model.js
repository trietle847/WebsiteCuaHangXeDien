const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const PaymentModel = sequelize.define(
  "Payment",
  {
    payment_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: {type: DataTypes.STRING},
    price_payment: {type: DataTypes.INTEGER}
  },
  {
    timestamps: false,
    tableName: "payment",
  }
);

PaymentModel.afterSync(async () => {
  const defaults = [
    { name: "Chuyển khoản", price_payment: 5000 },
    { name: "Tiền mặt", price_payment: 0 },
  ];

  for (const data of defaults) {
    await PaymentModel.findOrCreate({
      where: { name: data.name },
      defaults: data,
    });
  }
});

module.exports = PaymentModel;
