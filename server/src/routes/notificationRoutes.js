import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMyNotifications,markAsread} from "../controllers/notificationController.js";

const router = express.Router();

// Get my notifications
router.get("/", authMiddleware, getMyNotifications);

// Mark as read
router.put("/:id/read", authMiddleware, markAsread);

export default router;