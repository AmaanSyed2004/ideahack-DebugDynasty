const jwt= require('jsonwebtoken');

const authenticateJWT= (req,res,next)=>{
    const token= req.cookies.token;
    if(!token){
        return res.status(401).json({message: "No token provided"});
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            return res.status(403).json({message: "Invalid token"});
        }
        req.user= user;
        next();
    });
}

const authenticateWorker= (req,res,next)=>{
    if(req.user.role!=="worker"){
        return res.status(403).json({message: "Unauthorized"});
    }
    next();
}

const authenticateCustomer= (req,res,next)=>{
    if(req.user.role!=="customer"){
        return res.status(403).json({message: "Unauthorized"});
    }
    next();
}
module.exports = {authenticateJWT, authenticateWorker, authenticateCustomer};
