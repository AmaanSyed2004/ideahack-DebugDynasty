const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = require("./User");
const Department = require("./Department");
const Worker = sequelize.define("Worker", {
  userID: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: User,
      key: "userID",
    },
  },
  departmentID:{
    type: DataTypes.UUID,
    references: {
      model: Department,
      key: "departmentID",
    },
  },
  status:{
    type: DataTypes.ENUM('idle','in_appointment','handling_live'),
    defaultValue: 'idle'
  }
});

module.exports = Worker;