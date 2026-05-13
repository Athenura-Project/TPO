
import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
    getMyTPOs,
    getTPOById,
    createTPO,
    updateTPO,
    deleteTPO,
    getPerformance,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead
} from "../controllers/intern.controller.js";

const router = Router();

// ==================== TPO ROUTES ====================

// Get my TPOs
router.get("/tpos", auth, getMyTPOs);

// Get single TPO
router.get("/tpos/:id", auth, getTPOById);

// Create new TPO
router.post("/tpos", auth, createTPO);

// Update TPO
router.put("/tpos/:id", auth, updateTPO);

// Delete TPO
router.delete("/tpos/:id", auth, deleteTPO);

// ==================== PERFORMANCE ====================

// Get performance metrics
router.get("/performance", auth, getPerformance);

// ==================== NOTIFICATIONS ====================

// Get notifications
router.get("/notifications", auth, getNotifications);

// Mark single notification as read
router.put("/notifications/:id/read", auth, markNotificationRead);

// Mark all notifications as read
router.put("/notifications/read-all", auth, markAllNotificationsRead);

export default router;
