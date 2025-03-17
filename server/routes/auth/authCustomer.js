const express = require("express");
const register = require("../../controllers/auth/customer/register");
const login = require("../../controllers/auth/customer/login");
const upload = require("../../middleware/uploadPhoto");
const uploadRegisterFiles = require("../../middleware/uploadRegisterData");
const authRouterCustomer = express.Router();

authRouterCustomer.post("/register", uploadRegisterFiles, register);
authRouterCustomer.post("/login", upload.single("face_img"), login);
module.exports = authRouterCustomer;
