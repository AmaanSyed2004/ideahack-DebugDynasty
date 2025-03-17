const User = require('../../models/User');
const verify= async(req,res)=>{
    //this is a route to verify jwt, this will be hit by the frontend to verify the jwt every singel request 
    //when accesssing a protected route
    const userID = req.user.id;
    const user = await User.findByPk(userID);
    if(!user){
        return res.status(404).json({message: "User not found"});
    }
    return res.status(200).json({success:true, user:{
        id: user.userID,
        role: user.role,
        email: user.email,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName
    }});
}
module.exports= verify;