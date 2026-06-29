
import { Router } from "express";
import multer from "multer";
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
    markAllNotificationsRead,
    sendTPOEmail,
    bulkSendTPOEmails,
    getTPOEmailStatus
} from "../controllers/intern.controller.js";

const router = Router();

// Configure multer for memory storage (we just need base64 for Brevo)
const upload = multer({ storage: multer.memoryStorage() });

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

// ==================== EMAILS ====================

// Get TPO email status
router.get("/email-status", auth, getTPOEmailStatus);

// Send single email to TPO
router.post("/send-email", auth, upload.array("attachments"), sendTPOEmail);

// Send bulk emails to TPOs
router.post("/bulk-send-emails", auth, upload.array("attachments"), bulkSendTPOEmails);

export default router;
