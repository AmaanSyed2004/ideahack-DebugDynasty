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
    audio_data:{
      type: DataTypes.ARRAY(DataTypes.FLOAT), 
      allowNull: false
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
    hooks: {
      beforeCreate: (customer, options) => {
        // Set random values before creating a new Customer record
        
        customer.total_assets = generateRandomDecimal(1000, 100000);
        customer.credit_score = generateRandomInteger(300, 850);
        customer.active_loans = generateRandomInteger(0, 5);
        customer.total_loan_amount = generateRandomDecimal(1000, 50000);
        customer.missed_payments = generateRandomInteger(0, 20);
        customer.net_monthly_income = generateRandomDecimal(2000, 10000);
        customer.account_age_years = generateRandomInteger(1, 20);
        customer.monthly_transactions = generateRandomInteger(50, 500);
        customer.high_value_transactions = generateRandomInteger(0, 10);
      }
    }
  }
);

function generateRandomDecimal(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);  // Return a random decimal between min and max
}

function generateRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);  // Return a random integer between min and max
}
module.exports= Customer;