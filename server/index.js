const express = require('express');
const cors= require('cors');
require('dotenv').config();

const sequelize = require('./config/db'); 
const authRouter = require('./routes/auth');


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
  
app.use(express.json());

app.use('/auth', authRouter);
sequelize.sync({ alter: true }).then(()=>{ 
    app.listen(5555, () => {
        console.log(`Server is running on http://localhost:5555`);
    });
}).catch((error)=>{
    console.error('Unable to connect to the database:', error);
}
);    


