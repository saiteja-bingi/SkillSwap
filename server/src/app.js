import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// load env variables
dotenv.config();

// connect to database
connectDB();

const app = express();

// express.json() helps to parse incoming JSON requests
app.use(express.json());

// cors helps to connect frontend and backend
app.use(cors());

// routes
app.use("/api/auth",authRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/requests",requestRoutes);
app.use("/api/chat",chatRoutes);

app.get("/",(req,res)=>{
    res.send("SkillSwap API is running...")
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
