import express from "express";
import protect from "../middleware/authMiddleware.js";
import { sendMessage,getMyConversations, getMessages } from "../controllers/chatController.js";

const router=express.Router();

// send message
router.post("/:conversationId/message",protect,sendMessage);

// get my conversations
router.get("/my-conversations",protect,getMyConversations);

// get messages for specific conversation
router.get("/:conversationId/messages",protect,getMessages);

export default router;