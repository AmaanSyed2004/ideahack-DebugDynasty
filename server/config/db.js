const {Sequelize} = require('sequelize');

const sequelize= new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD,{
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
});

async function testConnection(){
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }catch(error){
        console.error('Unable to connect to the database:', error);
    }
}
testConnection();

module.exports = sequelize;
