const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Department = require("./Department");
const Worker = require("./Worker");
const Customer = require("./Customer");
const Appointment = sequelize.define("Appointment", {
  appointmentID: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  customerID: {
    type: DataTypes.UUID,
    references: {
        model: Customer,
        key: "userID",
    },
    allowNull: false,
  },
  workerID: {
    type: DataTypes.UUID,
    references:{
        model: Worker,
        key: "userID",
    },
    allowNull: false,

  },
    departmentID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
        model: Department,
        key: "departmentID",
    },
  },
  timeSlot: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("scheduled", "completed", "cancelled"),
    defaultValue: "scheduled",
  },
});
module.exports = Appointment;
