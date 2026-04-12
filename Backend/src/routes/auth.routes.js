import express from "express";
import { login, registerAdmin } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
const router = express.Router();


import { sendOTP, signup } from "../controllers/auth.controller.js";


router.post('/register', registerAdmin);
router.post('/login', login);


router.post("/send-otp", sendOTP);
router.post("/signup", signup);


router.get('/me', auth, (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
})

export default router

