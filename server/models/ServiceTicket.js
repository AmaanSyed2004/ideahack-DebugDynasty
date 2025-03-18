const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const User=require('./User');
const Department=require('./Department');
const ServiceTicket = sequelize.define('ServiceTicket',{
    ticketID:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userID:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'userID'
        }
    },
    departmentID:{
        type: DataTypes.UUID,
        allowNull: false,
        references:{
            model: Department,
            key: 'departmentID'
        }
    },
    status:{
        type: DataTypes.ENUM('pending','in_progress','completed'),
        defaultValue: 'pending'
    },
    resolution_mode:{
        type: DataTypes.ENUM('live','appointment'),
        allowNull: true
    },

    priority_score:{
        type: DataTypes.INTEGER,
        defaultValue: 50
    }
    //maybe left: fraud_risk
})
ServiceTicket.belongsTo(User, { foreignKey: 'userID' });
ServiceTicket.belongsTo(Department, { foreignKey: 'departmentID' });
module.exports= ServiceTicket;