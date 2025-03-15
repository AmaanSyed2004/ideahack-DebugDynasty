const express= require('express');
const register = require('../controllers/auth/register');
const login = require('../controllers/auth/login');

const authRouter= express.Router(); 

authRouter.post('/register', register);
authRouter.post('/login', login);
module.exports= authRouter;