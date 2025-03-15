const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const {Op}=  require("sequelize");
const setCookie = require("../../utils/jwt");
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
        if(!(await bcrypt.compare(password, user.password))){
            return res.status(400).json({message: "Invalid credentials"});
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
