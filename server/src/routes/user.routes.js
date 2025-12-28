import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { getProfile, updateProfile } from "../controllers/user.controller.js";

const router = Router();

// Fetch user profile
router.get("/profile", authenticateToken, getProfile);

// Update user profile
router.put("/profile", authenticateToken, updateProfile);

// Test protected route
router.get("/me", authenticateToken, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

export default router;
