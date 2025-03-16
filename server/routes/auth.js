const express= require('express');
const register = require('../controllers/auth/register');
const login = require('../controllers/auth/login');
const upload = require('../middleware/uploadFile');

const authRouter= express.Router(); 

authRouter.post('/register',upload.single("face_img"), register);
authRouter.post('/login' ,upload.single("face_img") , login);
module.exports= authRouter;