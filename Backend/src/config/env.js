import dotenv from "dotenv";
dotenv.config();

const config = {
    MONGO_URI: process.env.MONGO_URI ||
        "mongodb+srv://omkarjadhav415523_db_user:Pass%401234@cluster0.c6ik3pg.mongodb.net/tpo-management?retryWrites=true&w=majority",

    PORT: process.env.PORT || 5000,

    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

    NODE_ENV: process.env.NODE_ENV || "development",


    // ✅ FIXED
  BREVO_API_KEY: process.env.BREVO_API_KEY,

  // ✅ FIXED
  SENDER_EMAIL: process.env.SENDER_EMAIL,

  // optional mail (not needed if using Brevo)
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,

    ADMIN_SECRET: process.env.ADMIN_SECRET || "athenura@admin2024", // ✅ add this

    JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_here", // ✅ add if missing
};

console.log("ENV CHECK:", process.env.BREVO_API_KEY);

export default config;