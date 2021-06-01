//jshint esversion:8
const jwt = require('jsonwebtoken');
const verifyToken = (req,res,next) =>{
    //Authorization: bearer + token
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        //!unauthorized = 401
        return res.status(401).json({success:false,message:"Access token not found"});
    }
    try {
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
       console.log(error);
       //!forbidden  = 403 = ban
       return res.status(403).json({success:false,message:"Invalid token"});
    }
};
module.exports = verifyToken;