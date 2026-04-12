import dotenv from "dotenv";
dotenv.config();

const config = {
    MONGO_URI: process.env.MONGO_URI ||
        "mongodb+srv://omkarjadhav415523_db_user:Pass%401234@cluster0.c6ik3pg.mongodb.net/tpo-management?retryWrites=true&w=majority",

    PORT: process.env.PORT || 5000,

    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

    NODE_ENV: process.env.NODE_ENV || "development",

    MAIL_USER: process.env.MAIL_USER || "omkarjadhav200583@gmail.com",

    MAIL_PASS: process.env.MAIL_PASS || "ivadriusnhpubnxz" // no spaces
    
};


export default config;