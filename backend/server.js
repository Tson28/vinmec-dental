"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");

const connectDB = require("./src/config/db");
const corsOptions = require("./src/config/cors");
const {
  globalLimiter,
  authLimiter,
  chatLimiter,
  uploadLimiter,
  predictionLimiter,
} = require("./src/config/rateLimit");
const routes = require("./src/routes/index");
const { startJobs, stopJobs } = require("./src/jobs/index");
const sanitize = require("./src/middleware/sanitize");
const { requestLogger } = require("./src/middleware/requestLogger");
const swaggerDoc = require("./src/config/swagger");
const { errorHandler, notFound } = require("./src/middleware/errorHandle");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Connect DB ──────────────────────────────────────────────────────────────
connectDB();

// ─── Security ────────────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(cors(corsOptions));

// ─── Rate Limiting ───────────────────────────────────────────────────────────
app.use("/api/", globalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/chat/", chatLimiter);
app.use("/api/images/upload", uploadLimiter);
app.use("/api/predict/", predictionLimiter);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Input Sanitisation ──────────────────────────────────────────────────────
app.use(sanitize);

// ─── Request Logger ───────────────────────────────────────────────────────────
app.use(requestLogger);

// ─── Static Uploads ───────────────────────────────────────────────────────────
const uploadDir = path.join(
  __dirname,
  "..",
  process.env.UPLOAD_DIR || "uploads",
);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(uploadDir));

// ─── Swagger Docs (dev only) ─────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.get("/api/docs/json", (req, res) => res.json(swaggerDoc));
  app.get("/api/docs", (req, res) => {
    res.send(`<!DOCTYPE html><html><head><title>VinaMec API Docs</title>
      <meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" >
      </head><body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
      <script>SwaggerUIBundle({url:"/api/docs/json",dom_id:"#swagger-ui",presets:[SwaggerUIBundle.presets.apis,SwaggerUIBundle.SwaggerUIStandalonePreset],layout:"StandaloneLayout"})</script>
      </body></html>`);
  });
}

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use("/api", routes);

// Root
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🦷 VinaMec Dental Care API",
    version: "1.0.0",
    docs: "/api/health",
  });
});

// ─── 404 & Error Handlers ────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  // Start background jobs after server is up
  startJobs();
  console.log(`\n🚀 VinaMec API running on port ${PORT}`);
  console.log(`   Mode:     ${process.env.NODE_ENV}`);
  console.log(`   MongoDB:  ${process.env.MONGODB_URI}`);
  console.log(`   Uploads:  ${uploadDir}`);
  console.log(`   Health:   http://localhost:${PORT}/api/health\n`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received – shutting down gracefully");
  stopJobs();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err.message);
  server.close(() => process.exit(1));
});

module.exports = app;
