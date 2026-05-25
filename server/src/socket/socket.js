import { Server } from "socket.io";
import Message from "../models/Message.js";

const onlineUsers = {};

export const initializeSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: [
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

                console.log("Incoming Message:", data);

                // save message in database
                const newMessage = await Message.create({
                    conversation: data.conversationId,
                    sender: data.senderId,
                    text: data.text
                });

                // populate sender details
                const populatedMessage =
                    await newMessage.populate(
                        "sender",
                        "name profilepic"
                    );

                // get receiver socket
                const receiverSocketId =
                    onlineUsers[data.receiverId];

                // send to receiver
                if (receiverSocketId) {

                    io.to(receiverSocketId).emit(
                        "receive_message",
                        populatedMessage
                    );
                }

                // send back to sender
                socket.emit(
                    "receive_message",
                    populatedMessage
                );

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