import internsModels from "../models/internsadmin.models.js";
import jwt from "jsonwebtoken";
import config from "../config/env.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import { sendOTPEmail } from "../services/emailService.js";


// ================= TOKEN =================
const generateToken = (payload) => {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );
};

export const registerAdmin = async (req, res) => {
    try {
      const { name, email, password, adminSecret } = req.body;
  
      if (!name || !email || !password || !adminSecret) {
        return res.status(400).json({
          success: false,
          message: "All fields required",
        });
      }
  
      if (adminSecret !== config.ADMIN_SECRET) {
        return res.status(403).json({
          success: false,
          message: "Invalid admin secret",
        });
      }
  
      const exist = await internsModels.findOne({ email });
      if (exist) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
  
      // ✅ generate OTP
      const otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
  
      // ✅ send OTP email
      await sendOTPEmail(email, otp);
  
      // ✅ delete old OTP first
      await OTP.deleteMany({ email });
  
      // ✅ save new OTP
      await OTP.create({ email, otp });
  
      res.json({
        success: true,
        message: "OTP sent for admin registration",
      });
  
    } catch (error) {
      console.error("Admin register error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



  export const verifyAdmin = async (req, res) => {
    
    try {
      const { name, email, password, otp } = req.body;
  
      const recentOTP = await OTP.find({ email })
        .sort({ createdAt: -1 })
        .limit(1);
  
      if (!recentOTP.length || recentOTP[0].otp !== String(otp)) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }
  
      const hashed = await bcrypt.hash(password, 10);
  
      const admin = await internsModels.create({
        name,
        email,
        password: hashed,
        role: "admin",
        isVerified: true,
      });
  
      const token = generateToken({
        id: admin._id,
        role: "admin",
      });
  
      // ✅ delete OTP after success
      await OTP.deleteMany({ email });
  
      res.json({
        success: true,
        message: "Admin registered successfully",
        token,
        user: admin,
      });
  
    } catch (error) {
      console.error("Verify admin error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



  // export const sendOTP = async (req, res) => {
  //   try {
  //     const { email } = req.body;
  
  //     const existingUser = await internsModels.findOne({ email });
  //     if (existingUser) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "User already registered",
  //       });
  //     }
  
  //     const otp = otpGenerator.generate(6, {
  //       digits: true,
  //       upperCaseAlphabets: false,
  //       lowerCaseAlphabets: false,
  //       specialChars: false,
  //     });
  

  //     console.log("Generated OTP:", otp);


  //     await sendOTPEmail(email, otp);
  
  //     await OTP.deleteMany({ email }); // ✅ first delete
  //     await OTP.create({ email, otp }); // ✅ then save
  
  //     res.json({
  //       success: true,
  //       message: "OTP sent successfully",
  //     });
  
  //   } catch (error) {
  //     console.error("sendOTP error:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // };



  export const verifyOTP = async (req, res) => {
    try {
      const { email, otp, name, password } = req.body;
  
      const otpRecord = await OTP.findOne({ email, otp });
  
      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }
  
      // optional expiry check (recommended)
      const timeDiff = Date.now() - otpRecord.createdAt;
      if (timeDiff > 10 * 60 * 1000) {
        return res.status(400).json({
          success: false,
          message: "OTP expired",
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await internsModels.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
      });
  
      await OTP.deleteMany({ email });
  
      return res.json({
        success: true,
        message: "Admin registered successfully",
        user,
      });
  
    } catch (error) {
      console.error("OTP verify error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


  export const sendOTP = async (req, res) => {
    try {
      const { email } = req.body;
  
      const existingUser = await internsModels.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already registered",
        });
      }
  
      const otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
  
      console.log("Generated OTP:", otp);
  
      // 🔥 IMPORTANT: check email sending result
      const info = await sendOTPEmail(email, otp);
  
      console.log("EMAIL INFO:", info);
  
      await OTP.deleteMany({ email });
      await OTP.create({ email, otp });
  
      return res.json({
        success: true,
        message: "OTP sent successfully",
      });
  
    } catch (error) {
      console.error("sendOTP error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const testEmail = async (req, res) => {
    try {
      const result = await sendOTPEmail(
        "your_test_email@gmail.com",
        "123456"
      );
  
      res.json({ success: true, result });
  
    } catch (err) {
      console.log("TEST EMAIL ERROR:", err.response?.data || err.message);
  
      res.status(500).json({
        success: false,
        error: err.response?.data || err.message
      });
    }
  };

  export const login = async (req, res) => {
    try {
      
      console.log("LOGIN BODY:", req.body); // 👈 add this
      const { email, password } = req.body;
  

      // 1. Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password required",
        });
      }
  
      // 2. IMPORTANT: include password explicitly
      const user = await internsModels
        .findOne({ email })
        .select("+password"); // 🔥 FIX

        // 3. Check user exists
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      
      // 4. Check password exists (extra safety)
      if (!user.password) {
        return res.status(500).json({
          success: false,
          message: "Password not found in database",
        });
      }

      // 5. Compare password safely
      const match = await bcrypt.compare(password, user.password);
  
      if (!match) {
        return res.status(400).json({
          success: false,
          message: "Wrong password",
        });
      }

      // 6. Generate token
      const token = generateToken({
        id: user._id,
        role: user.role,
        email: user.email,
      });
  

      // 7. Remove password before sending response
      const safeUser = user.toObject();
      delete safeUser.password;


       return res.json({
        success: true,
        message: "Login successful",
        token,
            user: safeUser,
      });
  
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await internsModels.findOne({ email });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      const otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
  
      await sendOTPEmail(email, otp);
  
      await OTP.deleteMany({ email });
      await OTP.create({ email, otp });
  
      return res.json({
        success: true,
        message: "OTP sent for password reset",
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


  export const resetPassword = async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
  
      const record = await OTP.find({ email })
        .sort({ createdAt: -1 })
        .limit(1);
  
      if (!record.length || record[0].otp !== String(otp)) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }
  
      const hashed = await bcrypt.hash(newPassword, 10);
  
      await internsModels.findOneAndUpdate(
        { email },
        { password: hashed }
      );
  
      await OTP.deleteMany({ email });
  
      return res.json({
        success: true,
        message: "Password reset successful",
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };













