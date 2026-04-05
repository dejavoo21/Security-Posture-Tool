import cors from "cors";
import express from "express";
import "dotenv/config";

// Public Routes
import authRoutes from "./routes/public/auth.routes.js";
import assessmentRoutes from "./routes/public/assessment.routes.js";
import leaderboardRoutes from "./routes/public/leaderboard.routes.js";
import questionRoutes from "./routes/public/question.routes.js";

// Workspace Routes
import pdfRoutes from "./routes/workspace/pdf.routes.js";
import noteRoutes from "./routes/workspace/note.routes.js";
import resultRoutes from "./routes/workspace/result.routes.js";

// Admin Routes
import adminRoutes from "./routes/admin/admin.routes.js";
import consultantRoutes from "./routes/admin/consultant.routes.js";
import frameworkRoutes from "./routes/admin/framework.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "security-posture-tool-backend" });
});

// Public API
app.use("/api/public/auth", authRoutes);
app.use("/api/public/assessments", assessmentRoutes);
app.use("/api/public/leaderboard", leaderboardRoutes);
app.use("/api/public/questions", questionRoutes);

// Workspace API (Authenticated)
app.use("/api/workspace/reports", pdfRoutes);
app.use("/api/workspace/notes", noteRoutes);
app.use("/api/workspace/results", resultRoutes);

// Admin API (RBAC)
app.use("/api/admin", adminRoutes);
app.use("/api/admin/consultant", consultantRoutes);
app.use("/api/admin/framework-packs", frameworkRoutes);

export default app;
