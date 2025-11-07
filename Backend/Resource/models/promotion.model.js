const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const PromotionModel = sequelize.define(
  "Promotion",
  {
    promotion_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.STRING, allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    discount_type: {type: DataTypes.ENUM('fixed_amount', 'percentage'), allowNull: false}, // Loại khuyến mãi: tiền cố định hoặc phần trăm
    discount_value: {type: DataTypes.FLOAT, allowNull: false},
    minimum_order_value: {type: DataTypes.FLOAT, allowNull: true}, // Giá trị đơn hàng tối thiểu để áp dụng khuyến mãi
    max_discount_amount: {type: DataTypes.FLOAT, allowNull: true}, // Số tiền giảm giá tối đa (dành cho khuyến mãi theo %)
    // start_date: {type: DataTypes.DA, allowNull: false},
    // end_date: {type: DataTypes.DATE, allowNull: false}
  },
  {
    tableName: "promotion",
    timestamps: true,
    createdAt: false,
    updatedAt: false,
    paranoid: true,
  }
);

module.exports = PromotionModel;
