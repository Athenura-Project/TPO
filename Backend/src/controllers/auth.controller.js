import internsModels from "../models/interns.models.js";
import { ComparePassword, HashPassword } from "../services/password.service.js";
import { GenerateToken } from "../services/token.service.js";
import { validateLogin, validateRegister } from "../validators/authValidator.js";

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

export {registerAdmin , login}