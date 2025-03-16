const express= require('express');
const register = require('../controllers/auth/register');
const login = require('../controllers/auth/login');
const upload = require('../middleware/uploadPhoto');
const uploadRegisterFiles = require('../middleware/uploadRegisterData');
const authRouter= express.Router(); 

authRouter.post('/register',uploadRegisterFiles, register);
authRouter.post('/login' ,upload.single("face_img") , login);
module.exports= authRouter;