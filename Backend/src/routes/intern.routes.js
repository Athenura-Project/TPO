import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
    getMyTPOs,
    createTPO,
    updateTPO,
    getPerformance,
    getNotifications,
    markNotificationRead
} from "../controllers/intern.controller.js";

const router = Router();

router.get("/tpos", auth, getMyTPOs);
router.post("/tpos", auth, createTPO);
router.put("/tpos/:id", auth, updateTPO);

router.get("/performance", auth, getPerformance);

router.get("/notifications", auth, getNotifications);
router.put("/notifications/:id/read", auth, markNotificationRead);

export default router;