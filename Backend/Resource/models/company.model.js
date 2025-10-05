const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const CompanyModel = sequelize.define(
  "Company",
  {
    company_id: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true,},
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false},

  },
  {
    tableName: "company",
    timestamps: false,
  }
);

module.exports = CompanyModel;
