import internsModels from "../models/interns.models.js";
import { ComparePassword, HashPassword } from "../services/password.service.js";
import { GenerateToken } from "../services/token.service.js";
import { validateLogin, validateRegister } from "../validators/authValidator.js";
import config from "../config/env.js"; // ✅ add this
import OTP from "../models/OTP.js";
import { mailSender } from "../utils/mailSender.js";
import { otpTemplate } from "../mail/templates/otpTemplate.js";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";

// 🔹 Register Admin
const registerAdmin = async (req, res) => {      // ← function starts here
    try {
        const { name, email, password, adminSecret } = req.body;

        // ✅ admin secret check INSIDE the function
        if (adminSecret !== config.ADMIN_SECRET) {
            return res.status(403).json({
                success: false,
                message: "Invalid admin secret key",
            });
        }

        const error = validateRegister({ name, email, password });
        if (error) {
            return res.status(400).json({ success: false, message: error });
        }

        const existingUser = await internsModels.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const admin = await internsModels.create({
            name,
            email,
            password: hashPassword,
            role: "admin",
        });

        const token = await GenerateToken({
            id: admin._id,
            role: admin.role,
            email: admin.email,
        });

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            token,
            user: admin,
        });

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};                                               // ← function ends here

// 🔹 Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const error = validateLogin({ email, password });
        if (error) {
            return res.status(400).json({ success: false, message: error });
        }

        const existingUser = await internsModels.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = await GenerateToken({
            id: existingUser._id,
            role: existingUser.role,
            email: existingUser.email,
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: existingUser,
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error during login" });
    }
};

// 🔹 Send OTP
// 🔹 Send OTP
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user already exists
        const existingUser = await internsModels.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ // Use 400 for errors
                success: false, 
                message: "User already registered with this email" 
            });
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false, // Numbers only is better for UX
            specialChars: false,
        });

        // 🔴 CRITICAL: Await mail sending BEFORE saving to DB or responding
        try {
            await mailSender(email, "OTP Verification Code", otpTemplate(otp));
            console.log("OTP Email sent to:", email);
        } catch (mailError) {
            console.error("MailSender failed:", mailError);
            return res.status(500).json({ 
                success: false, 
                message: "Gmail service failed. Check App Password." 
            });
        }

        // Save to DB only after email is successfully sent
        await OTP.create({ email, otp });

        res.status(200).json({ success: true, message: "OTP sent successfully" });

    } catch (error) {
        console.error("sendOTP logic error:", error);
        res.status(500).json({ success: false, message: "Server error while generating OTP" });
    }
};

// 🔹 Signup with OTP
const signup = async (req, res) => {
    try {
        const { name, email, password, otp } = req.body;

        const recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

        if (!recentOTP.length || recentOTP[0].otp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await internsModels.create({
            name,
            email,
            password: hashedPassword,
            isVerified: true,
        });

        res.json({ success: true, user });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, message: "Signup failed" });
    }
};

export { registerAdmin, login, sendOTP, signup };