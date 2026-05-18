import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMyNotifications,markAsread,clearAllNotifications} from "../controllers/notificationController.js";

const router = express.Router();

// Get my notifications
router.get("/", authMiddleware, getMyNotifications);

// Clear all notifications
router.delete("/clear-all", authMiddleware, clearAllNotifications);

// Mark as read
router.put("/:id/read", authMiddleware, markAsread);

export default router;