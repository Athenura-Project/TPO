import internsModels from "../models/interns.models.js";
import { VerifyToken } from "../services/token.service.js";

const auth = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // ❌ No token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token missing",
            });
        }

        const decoded = await VerifyToken(token);

        req.user = await internsModels.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}

const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied, admin only",
        });
    }else{
        next()
    }
}
export {auth, adminOnly}