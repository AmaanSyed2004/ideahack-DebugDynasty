const sequelize = require("../config/db");
const { Sequelize, DataTypes } = require("sequelize");

const User = require("./User");

const Customer = sequelize.define(
  "Customer",
  {
    userID: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: User,
        key: "userID",
      },
    },
    total_assets: DataTypes.DECIMAL,
    credit_score: DataTypes.INTEGER,
    active_loans: DataTypes.INTEGER,
    total_loan_amount: DataTypes.DECIMAL,
    missed_payments: DataTypes.INTEGER,
    net_monthly_income: DataTypes.DECIMAL,
    account_age_years: DataTypes.INTEGER,
    monthly_transactions: DataTypes.INTEGER,
    high_value_transactions: DataTypes.INTEGER,
  },
  {
    timestamps: true,
  }
);

module.exports= Customer;