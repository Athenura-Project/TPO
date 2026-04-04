import { Router } from "express";
import { login, registerAdmin } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router()

router.post('/register', registerAdmin);
router.post('/login', login);
router.get('/me', auth, (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
})

export default router