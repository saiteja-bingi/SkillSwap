import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// load env variables
dotenv.config();

// connect to database
connectDB();

const app = express();

// express.json() helps to parse incoming JSON requests
app.use(express.json());

// cors helps to connect frontend and backend
app.use(cors());

app.get("/",(req,res)=>{
    res.send("SkillSwap API is running...")
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
