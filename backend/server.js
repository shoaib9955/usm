import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import dbConfig from "./config/database.js";
import errorHandlerMiddleware from "./middleware/errorHandler.js";
import helpers from "./utils/helpers.js";

const { connectDB, disconnectDB } = dbConfig;
const {
  globalErrorHandler,
  notFoundHandler,
  handleUnhandledRejection,
  handleUncaughtException,
} = errorHandlerMiddleware;
const { validateEnv } = helpers;

// Validate required environment variables
validateEnv(["MONGODB_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"]);

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use(limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // Increased to 15 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    const resetTime = req.rateLimit.resetTime;
    const secondsLeft = Math.ceil((resetTime - Date.now()) / 1000);
    res.status(options.statusCode).json({
      success: false,
      message: `Too many login attempts. Please try again in ${secondsLeft} seconds.`,
    });
  },
});

app.use("/api/auth/login", authLimiter);

// Body parsing middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "UP",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User Management System API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      profile: "/api/profile",
    },
  });
});

// Handle undefined routes
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

// Handle unhandled promise rejections
process.on("unhandledRejection", handleUnhandledRejection);

// Handle uncaught exceptions
process.on("uncaughtException", handleUncaughtException);

// Start server
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "production"} mode on port ${PORT}`,
  );
});

// Handle server startup errors
server.on("error", (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Graceful shutdown helper
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  // Force close after 10 seconds
  setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);

  server.close(async () => {
    console.log("Http server closed.");
    try {
      await disconnectDB();
      console.log("Database connection closed.");
      process.exit(0);
    } catch (err) {
      console.error("Error during database disconnection:", err);
      process.exit(1);
    }
  });
};

// Handle termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default app;

