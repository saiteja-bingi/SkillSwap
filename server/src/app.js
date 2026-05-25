import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";


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
app.use("/api/notifications", notificationRoutes);

app.get("/",(req,res)=>{
    res.send("SkillSwap API is running...")
});

export default app;
