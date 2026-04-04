import express from "express";
import config from "./src/config/env.js";
import connectDB from "./src/config/database.js";

const app = express()

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

(async () => {
    try {
        // DB connection will go here
        await connectDB()

        app.listen(config.PORT, () => {
            console.log(`Server running on port ${config.PORT}`);
        });
    } catch (error) {
        console.error("Server failed to start:", error);
        process.exit(1);
    }
})()