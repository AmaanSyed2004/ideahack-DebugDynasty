const express = require("express");
const register = require("../../controllers/auth/worker/register");
const upload = require("../../middleware/uploadPhoto");
const login = require("../../controllers/auth/worker/login");

const authRouterWorker = express.Router();

authRouterWorker.post("/register", upload.single("face_img"), register);
authRouterWorker.post("/login", upload.single("face_img"), login);
module.exports = authRouterWorker;
