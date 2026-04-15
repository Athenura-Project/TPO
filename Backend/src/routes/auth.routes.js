import express from "express";
import {
  login,
  registerAdmin,
  verifyAdmin,
  sendOTP,

} from "../controllers/auth.controller.js";

import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();


// ================= ADMIN =================
router.post("/register-admin", registerAdmin);   // send OTP
router.post("/verify-admin", verifyAdmin);       // verify OTP + create admin

// ================= USER =================
router.post("/send-otp", sendOTP);               // send OTP
// router.post("/signup", signup);                  // verify OTP + create user

// ================= LOGIN =================
router.post("/login", login);

// ================= PROTECTED =================
router.get("/me", auth, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});



export default router

