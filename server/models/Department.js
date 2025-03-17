const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Department = sequelize.define('Department',{
    departmentID:{
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    departmentName:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    roundRobinIndex:{
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
})

module.exports= Department;