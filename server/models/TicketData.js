const sequelize = require('../config/db');
const {Sequelize, DataTypes } = require('sequelize');
const ServiceTicket= require('./ServiceTicket');

const TicketData = sequelize.define('TicketData',{
    id:{
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    ticketID:{
        type: DataTypes.UUID,
        allowNull: false,
        references:{
            model: ServiceTicket,
            key: 'ticketID'
        }
    },
    type:{
        type: DataTypes.ENUM('text','audio','video'),
        allowNull: false
    },
    content:{
        type: DataTypes.TEXT, //could be either text or path to a file
        allowNull: false
    },
    transcription:{
        type: DataTypes.TEXT,
        allowNull: true
    }
})
ServiceTicket.hasOne(TicketData, { foreignKey: 'ticketID' });
TicketData.belongsTo(ServiceTicket, { foreignKey: 'ticketID' });

module.exports = TicketData;