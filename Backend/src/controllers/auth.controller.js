import internsModels from "../models/interns.models.js";
// import { ComparePassword, HashPassword } from "../services/password.service.js";
// import { GenerateToken } from "../services/token.service.js";
// import { validateLogin, validateRegister } from "../validators/authValidator.js";

import jwt from "jsonwebtoken";
import config from "../config/env.js"; // ✅ add this
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import { sendOTPEmail } from "../services/emailService.js";


// ================= TOKEN =================
const generateToken = (payload) => {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );
  };



// // 🔹 Register Admin
// const registerAdmin = async (req, res) => {      // ← function starts here
//     try {
//         const { name, email, password, adminSecret } = req.body;

//         // ✅ check admin secret
//         if (adminSecret !== config.ADMIN_SECRET) {
//           return res.status(403).json({
//             success: false,
//             message: "Invalid admin secret key",
//           });
//         }

//         const error = validateRegister({ name, email, password });
//         if (error) {
//             return res.status(400).json({ success: false, message: error });
//         }

//         const existingUser = await internsModels.findOne({ email });
//         if (existingUser) {
//           return res.status(400).json({
//             success: false,
//             message: "Email already registered",
//           });
//         }


//         const hashPassword = await bcrypt.hash(password, 10);

//         const admin = await internsModels.create({
//             name,
//             email,
//             password: hashPassword,
//             role: "admin",
//         });

//         const token = await GenerateToken({
//             id: admin._id,
//             role: admin.role,
//             email: admin.email,
//         });

//         res.status(201).json({
//             success: true,
//             message: "Admin registered successfully",
//             token,
//             user: admin,
//         });

//     } catch (error) {
//         console.error("Register error:", error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };                                               // ← function ends here

// // 🔹 Login
// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const error = validateLogin({ email, password });
//         if (error) {
//             return res.status(400).json({ success: false, message: error });
//         }

//         const existingUser = await internsModels.findOne({ email });
//         if (!existingUser) {
//             return res.status(400).json({ success: false, message: "Invalid email or password" });
//         }

//         const isMatch = await bcrypt.compare(password, existingUser.password);
//         if (!isMatch) {
//             return res.status(400).json({ success: false, message: "Invalid email or password" });
//         }

//         const token = await GenerateToken({
//             id: existingUser._id,
//             role: existingUser.role,
//             email: existingUser.email,
//         });

//         res.status(200).json({
//             success: true,
//             message: "Login successful",
//             token,
//             user: existingUser,
//         });

//     } catch (error) {
//         console.error("Login error:", error);
//         res.status(500).json({ success: false, message: "Server error during login" });
//     }
// };







// ================= LOGIN =================
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await internsModels.findOne({ email });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (!email || !password) {
//         return res.status(400).json({
//           success: false,
//           message: "Email and password required",
//         });
//       }

//     const match = await bcrypt.compare(password, user.password);

//     if (!match) {
//       return res.status(400).json({
//         success: false,
//         message: "Wrong password",
//       });
//     }

//     const token = generateToken({
//       id: user._id,
//       role: user.role,
//       email: user.email,
//     });

//     res.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user,
//     });

//   } catch (error) {
//     console.error("🔥 Login error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };










// ================= ADMIN REGISTER =================
// export const registerAdmin = async (req, res) => {
//   try {
//     const { name, email, password, adminSecret } = req.body;


//     // ✅ check secret
//     if (adminSecret !== config.ADMIN_SECRET) {
//       return res.status(403).json({
//         success: false,
//         message: "Invalid admin secret",
//       });
//     }

//     // ✅ check existing
//     const exist = await internsModels.findOne({ email });
//     if (exist) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already exists",
//       });
//     }

//     // ✅ generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     const hashPassword = await bcrypt.hash(password, 10);

//     const admin = await internsModels.create({
//       name,
//       email,
//       password: hashPassword,
//       role: "admin",
//       isVerified: true,
//     });

//     const token = generateToken({
//       id: admin._id,
//       role: "admin",
//     });

//     res.json({
//       success: true,
//       message: "Admin registered",
//       token,
//       user: admin,
//     });

//   } catch (error) {
//     console.error("Admin error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

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
  
      await sendOTPEmail(email, otp);
  
      await OTP.deleteMany({ email }); // ✅ first delete
      await OTP.create({ email, otp }); // ✅ then save
  
      res.json({
        success: true,
        message: "OTP sent successfully",
      });
  
    } catch (error) {
      console.error("sendOTP error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password required",
        });
      }
  
      const user = await internsModels.findOne({ email });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }
  
      const match = await bcrypt.compare(password, user.password);
  
      if (!match) {
        return res.status(400).json({
          success: false,
          message: "Wrong password",
        });
      }
  
      const token = generateToken({
        id: user._id,
        role: user.role,
        email: user.email,
      });
  
      res.json({
        success: true,
        message: "Login successful",
        token,
        user,
      });
  
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



















// ================= SEND OTP =================
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

//     // ✅ send email (FIXED)
//     await sendOTPEmail(email, otp);

//     // save OTP
//     await OTP.create({ email, otp });
//     await OTP.deleteMany({ email });

//     res.status(200).json({
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


// ================= SIGNUP (OTP VERIFY) =================

// export const signup = async (req, res) => {
//     try {
//       const { name, email, password, otp } = req.body;
  
//       // ✅ check required fields
//       if (!name || !email || !password || !otp) {
//         return res.status(400).json({
//           success: false,
//           message: "All fields are required",
//         });
//       }
  
//       // ✅ check if user already exists
//       const existingUser = await internsModels.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({
//           success: false,
//           message: "User already exists",
//         });
//       }
  
//       // ✅ get latest OTP
//       const recentOTP = await OTP.find({ email })
//         .sort({ createdAt: -1 })
//         .limit(1);
  
//       if (!recentOTP.length) {
//         return res.status(400).json({
//           success: false,
//           message: "OTP expired or not found",
//         });
//       }
  
//       // ✅ compare OTP (string safe)
//       if (recentOTP[0].otp !== String(otp)) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid OTP",
//         });
//       }
  
//       // ✅ hash password
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       // ✅ create user
//       const user = await internsModels.create({
//         name,
//         email,
//         password: hashedPassword,
//         role: "user",
//         isVerified: true,
//       });
  
//       // ✅ delete OTP after use (VERY IMPORTANT)
//       await OTP.deleteMany({ email });
  
//       res.status(200).json({
//         success: true,
//         message: "Signup successful",
//         user,
//       });
  
//     } catch (error) {
//       console.error("Signup error:", error);
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };


