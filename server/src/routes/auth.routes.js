// src/routes/auth.routes.js
import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const router = Router();

router.get("/google", authController.redirectToGoogle);
router.get("/google/callback", authController.handleGoogleCallback);

export default router;
