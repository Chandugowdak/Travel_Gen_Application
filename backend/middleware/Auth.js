const JWT = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const verifyUser = async(req,res,next)=>{
    const User_Token = req.header('authorization');

    if(!User_Token){
        return res.status(400).json({ message: "No token provided, authorization denied" });
    }

    const Decode_Token = User_Token.split(' ')[1];
    try{
        const decode = JWT.verify(Decode_Token,JWT_SECRET_KEY);
        req.user = decode;
        next();
    }
    catch(err){
        return res.status(401).json({ message: "Invalid token, authorization denied" });
    }
}

module.exports = verifyUser;