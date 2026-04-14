import express from "express";
import cors from "cors";  // ✅ add this
import config from "./src/config/env.js";
import connectDB from "./src/config/database.js";
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import internRoutes from "./src/routes/intern.routes.js";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const app = express();

// ✅ CORS - must be before routes
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

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
    await connectDB();
    app.listen(config.PORT, () => {
      console.log(`Server running on port http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
})();