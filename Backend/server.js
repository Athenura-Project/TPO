import express from "express";
import cors from "cors";  
import config from "./src/config/env.js";
import helmet from "helmet";
import connectDB from "./src/config/database.js";
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import internRoutes from "./src/routes/intern.routes.js";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const app = express();

// ==================== MIDDLEWARE ====================

// ✅ CORS - must be before routes
app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  );

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173"
      ];
  
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  }));

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));



// Middleware

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/intern", internRoutes);


// Test route
app.get("/", (req, res) => {
  res.json({
      success: true,
      message: "✅ TPO Management Server is running 🚀",
      version: "1.0.0"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
      success: true,
      message: "Server is running",
      timestamp: new Date()
  });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});



// ==================== SERVER STARTUP ====================


const PORT = config.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Start server
        app.listen(PORT, () => {
            console.log(`\n✅ Server is running on port http://localhost:${PORT}`);
            console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
            console.log(`🗄️  Database: ${config.MONGO_URI || "mongodb://localhost:27017/tpo-management"}`);
            console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || "http://localhost:3000"}\n`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on("SIGINT", () => {
    console.log("\n\n👋 Received SIGINT, shutting down gracefully...");
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log("\n\n👋 Received SIGTERM, shutting down gracefully...");
    process.exit(0);
});


startServer();

export default app;
