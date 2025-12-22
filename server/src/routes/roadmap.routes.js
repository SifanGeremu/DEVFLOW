// src/routes/roadmap.routes.js

import express from "express";
import roadmapController from "../controllers/roadmap.controller.js";
import authenticateToken from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Generate a roadmap
 * POST /roadmaps/generate
 */
router.post(
  "/roadmaps/generate",
  authenticateToken,
  roadmapController.generateRoadmap
);

/**
 * Fetch all tasks for the authenticated user
 * GET /tasks
 */
router.get("/tasks", authenticateToken, roadmapController.getTasks);

export default router;
