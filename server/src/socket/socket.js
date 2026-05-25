import { Server } from "socket.io";
import Message from "../models/Message.js";

const onlineUsers = {};

export const initializeSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                "https://skill-swap-ten-vert.vercel.app"
            ],
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {

        console.log(`User connected: ${socket.id}`);

        // register user
        socket.on("register_user", (userId) => {

            onlineUsers[userId] = socket.id;

            console.log("Online Users:", onlineUsers);

            io.emit(
                "get_online_users",
                Object.keys(onlineUsers)
            );
        });

        // private message
        socket.on("private_message", async (data) => {

            try {

                const newMessage = await Message.create({
                    conversation: data.conversationId,
                    sender: data.senderId,
                    text: data.text
                });

                const populatedMessage =
                    await newMessage.populate(
                        "sender",
                        "name profilepic"
                    );

                const receiverSocketId =
                    onlineUsers[data.receiverId];

                // send only to receiver
                if (receiverSocketId) {

                    io.to(receiverSocketId).emit(
                        "receive_message",
                        populatedMessage
                    );
                }

            } catch (error) {

                console.error(
                    "Message error:",
                    error
                );
            }
        });

        // disconnect
        socket.on("disconnect", () => {

            for (const userId in onlineUsers) {

                if (
                    onlineUsers[userId] === socket.id
                ) {

                    delete onlineUsers[userId];
                    break;
                }
            }

            console.log(
                `User disconnected: ${socket.id}`
            );

            console.log(
                "Online Users:",
                onlineUsers
            );

            io.emit(
                "get_online_users",
                Object.keys(onlineUsers)
            );
        });
    });
};