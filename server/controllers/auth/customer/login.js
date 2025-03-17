const User = require("../../../models/User");
const bcrypt = require("bcryptjs");
const {Op}=  require("sequelize");
const FormData = require('form-data');
const axios = require('axios');
const setCookie = require("../../../utils/jwt");
const login = async (req, res) => {
    const {phoneNumber, password, email} = req.body;
    if(!phoneNumber && !email){
        return res.status(400).json({message: "Phone number or email is required"});
    }
    if(!password){
        return res.status(400).json({message: "Password is required to login"});
    }
    if(phoneNumber && email){
        return res.status(400).json({message: "Please provide either phone number or email"});
    }
    const face_img= req.file;
    if(!face_img){
        return res.status(400).json({ message: "Face image is required" });
    }
    try{
        let user;
        if(phoneNumber){
            user = await User.findOne({
                where: {
                    phoneNumber: {
                        [Op.eq]: phoneNumber
                    }
                }
            });
        } else {
            user = await User.findOne({
                where: {
                    email: {
                        [Op.eq]: email
                    }
                }
            });
        }

        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        if(!(user.role==="customer")){
            return res.status(403).json({message: "User is not a customer"}) 
        }
        if(!(await bcrypt.compare(password, user.password))){
            return res.status(400).json({message: "Invalid credentials"});
        }
        //now, sending the request to the ml model to check the validity of the face image
        const formData= new FormData();
        formData.append("image", face_img.buffer, {
            filename: face_img.originalname,
            contentType: face_img.mimetype
        })
        const embedding = JSON.stringify(user.face_data);
        formData.append("embedding", embedding);
        const face_match= await axios.post("http://localhost:8000/verify_face", formData,{
            headers: { "Content-Type": "multipart/form-data" }
        })
        console.log(face_match.data);
        if(face_match.data.error){
            return res.status(400).json({message: face_match.data.error});
        }
        if(!face_match.data.is_match){
            return res.status(400).json({message: "Face image does not match"});
        }

        setCookie(res, user);
        res.status(200).json({message: "User logged in successfully"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
};

module.exports = login;
