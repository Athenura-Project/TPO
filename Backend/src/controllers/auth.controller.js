import internsModels from "../models/interns.models.js";
import { ComparePassword, HashPassword } from "../services/password.service.js";
import { GenerateToken } from "../services/token.service.js";
import { validateLogin, validateRegister } from "../validators/authValidator.js";



import OTP from "../models/OTP.js";

import { mailSender } from "../utils/mailSender.js";
import { otpTemplate } from "../mail/templates/otpTemplate.js";

import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";



// 🔹 Register Admin
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // use validator
        const error = validateRegister({ name, email, password })

        if (error) {
            return res.status(400).json({
                success: false,
                message: error,
            });
        }

        // Check existing user

        const existingUser = await internsModels.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        // hash password

        const hashPassword = await HashPassword(password);

        // create admin
        const admin = await internsModels.create({
            name,
            email,
            password: hashPassword,
            role: "admin"
        })
        // ✅ FIX: generate token
    const token = await GenerateToken({
      id: admin._id,
      role: admin.role,
      email: admin.email,
    });
    

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            token,
            user: admin
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const error = validateLogin({ email, password })

        if (error) {
            return res.status(400).json({
                success: false,
                message: error,
            });
        }
        const existingUser = await internsModels.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await ComparePassword(password, existingUser.password)

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // generate Token
        let payload = {
            id:existingUser._id,
            role:existingUser.role,
            email:existingUser.email
        }

        const token = await GenerateToken(payload)

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: existingUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
}


const sendOTP = async (req, res) => {
    try {
      const { email } = req.body;
  
      const existingUser = await internsModels.findOne({ email });
  
      if (existingUser) {
        return res.json({ success: false, message: "User exists" });
      }
  
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
      });
  
      await OTP.create({ email, otp });
  
      await mailSender(email, "OTP Verification", otpTemplate(otp));
  
      res.json({ success: true, message: "OTP sent" });
  
    } catch (error) {
      res.status(500).json({ success: false, message: "Error sending OTP" });
    }
  };
  
  
  // 🔹 Signup with OTP
  const signup = async (req, res) => {
    try {
      const { name, email, password, otp } = req.body;
  
      const recentOTP = await OTP.find({ email })
        .sort({ createdAt: -1 })
        .limit(1);
  
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
      res.status(500).json({ success: false, message: "Signup failed" });
    }
  };
  


  export { registerAdmin, login, sendOTP, signup };