import express from "express";
import config from "./src/config/env.js";
import connectDB from "./src/config/database.js";
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import internRoutes from "./src/routes/intern.routes.js";

import dns from "dns";

dns.setDefaultResultOrder("ipv4first");


const app = express()

// Middleware
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/intern", internRoutes);


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

app.listen(5000, () => {
    console.log(`Server running on port http://localhost:5000`);
  });