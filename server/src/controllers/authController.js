import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// register user
export const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        // check existing users
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        // hash password
        const hashedPassword=await bcrypt.hash(password,10);

        // create new user
        const user=await User.create({
            name,
            email,
            password:hashedPassword
        });
        res.status(201).json({
            message:"User registered successfully"
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

// login user

export const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Invalid credentials"
            });
        }

        // compare password
        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({
                message:"Invalid Credentials"
            });
        }

        // generate token
        // jwt.sign(payload,secretKey,options)
        const token=jwt.sign(
            {id:user._id}, // payload
            process.env.JWT_SECRET, // secret key
            {expiresIn:"7d"} // expiry time
        );

        res.status(200).json({
            message:"Login Successful",
            token
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

// get logged in user profile
export const getProfile=async(req,res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(error){
        res.status(500).json({
            message:error.messsage
        });
    }
};

// status codes:
// 400-bad request
// 401-unauthorized
// 404-not found
// 500-internal server error
// 200-ok
// 201-created