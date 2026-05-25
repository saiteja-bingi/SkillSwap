import { Server } from "socket.io";
import Message from '../models/Message.js'

const onlineUsers={};

export const initializeSocket = (server) => {
    // create socket server
    const io = new Server(server, {
        cors: {
            origin:"http://localhost:5173",
            methods:["GET","POST"]
        }
    });

    // runs whenever a client connects
    io.on("connection",(socket)=>{
        console.log(`User connected: ${socket.id}`);

        socket.on("register_user",(userId)=>{
            onlineUsers[userId]=socket.id;
            console.log("Online Users:",onlineUsers);
            io.emit("get_online_users", Object.keys(onlineUsers));
        })

        socket.on("private_message",async(data)=>{
            try{
                // save messages in database
                const newMessage=await Message.create({
                    conversation:data.conversationId,
                    sender:data.senderId,
                    text:data.text
                });

                // populate sender details
                const populatedMessage=await newMessage.populate(
                    "sender",
                    "name profilepic"
                )

                // identify receiver
                const receiverSocketId=onlineUsers[data.receiverId];

                // send to receiver
                if(receiverSocketId){
                    io.to(receiverSocketId).emit(
                        "receive_message",
                        populatedMessage
                    );
                }

                // send to sender too
                socket.emit(
                    "receive_message",
                    populatedMessage
                );  
                
            }
            catch(error){
                console.error("Message error:",error);
            }
        })

        // runs when client disconnects
        socket.on("disconnect",()=>{
            for( const userId in onlineUsers){
                if(onlineUsers[userId]==socket.id){
                    delete onlineUsers[userId];
                    break;
                }
            }
            console.log(`User disconnected: ${socket.id}`);
            console.log("Online Users:",onlineUsers);
            io.emit("get_online_users", Object.keys(onlineUsers));
        });
    });
};