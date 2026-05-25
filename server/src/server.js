import http from "http";
import dotenv from "dotenv";

import app from './app.js';
import connectDB from './config/db.js';

import { initializeSocket } from "./socket/socket.js";

// load environment variables
dotenv.config();

// connect database
connectDB();

// create server
const server = http.createServer(app);
initializeSocket(server)

const PORT=process.env.PORT || 5000;

// start server
server.listen(PORT,()=>{
    console.log(`Server is runnning on port: ${PORT}`);
})





// go to package.json to edit the nom run dev in dev option