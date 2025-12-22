import express from "express";
import {
  getTodayTasks,
  completeTask,
} from "../controllers/task.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Today’s tasks
router.get("/today", authenticateToken, getTodayTasks);

// Complete task 
router.patch("/:id/complete", authenticateToken, completeTask);

export default router;
