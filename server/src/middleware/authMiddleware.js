import jwt from "jsonwebtoken"
import User from "../models/User.js"

const protect=async(req ,res ,next)=>{
    let token;

    // check Authorization header exists
    if(req.headers.authorization&&
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            // extract token
            token=req.headers.authorization.split(" ")[1];

            // verify token
            const decoded=jwt.verify(token,process.env.JWT_SECRET);

            // find user by token id(excluded password)
            // -password means password will not be included in the response
            req.user=await User.findById(decoded.id).select("-password");
            next();
        }
        catch(error){
            console.error(error);
            res.status(401).json({
                message:"Not authorized,token failed"
            });
        }
    }

    if(!token){
        res.status(401).json({
            message:"Not authorized,no token"
        });
    }
};

export default protect;