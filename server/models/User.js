const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User= sequelize.define('User',{
    userID:{
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    fullName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    face_data:{
        type: DataTypes.ARRAY(DataTypes.FLOAT), 
        allowNull: false
    },
    role:{
        type: DataTypes.ENUM('customer','worker'),
        allowNull: false
    }
})
module.exports = User;