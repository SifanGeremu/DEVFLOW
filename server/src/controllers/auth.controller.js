// src/controllers/auth.controller.js

import jwt from "jsonwebtoken";
import {
  buildGoogleAuthUrl,
  exchangeCodeForTokens,
  verifyIdToken,
  findOrCreateUser,
} from "../services/auth.service.js";

/**
 * GET /auth/google
 * Redirects the user to Google's OAuth consent screen
 */
export async function redirectToGoogle(req, res) {
  try {
    const authUrl = await buildGoogleAuthUrl();
    // Use 302 explicitly to avoid browser caching the redirect
    return res.redirect(302, authUrl);
  } catch (err) {
    console.error(
      "[AuthController] redirectToGoogle error:",
      err.message || err
    );
    return res.status(500).json({
      error: "Failed to initiate Google authentication",
    });
  }
}

/**
 * GET /auth/google/callback
 * Handles redirect from Google after user consent
 * Issues our own JWT and redirects to frontend with token
 */
export async function handleGoogleCallback(req, res) {
  const { code } = req.query;

  // Validate code presence and type
  if (!code || typeof code !== "string") {
    console.warn("[AuthController] Missing or invalid authorization code");
    return res.redirect(
      `${
        process.env.FRONTEND_URL || "http://localhost:8080"
      }/login?error=missing_code`
    );
  }

  try {
    // 1. Exchange code for Google tokens (includes id_token)
    const tokens = await exchangeCodeForTokens(code);

    if (!tokens?.id_token) {
      throw new Error("Google did not return an id_token");
    }

    // 2. Verify the Google ID token (authenticity + integrity)
    const googlePayload = await verifyIdToken(tokens.id_token);

    // Required field: Google's unique user ID
    if (!googlePayload.sub) {
      throw new Error("Invalid Google token: missing 'sub' (google_id)");
    }

    // 3. Find existing user or create new one (idempotent)
    const user = await findOrCreateUser({
      google_id: googlePayload.sub,
      name: googlePayload.name || "User",
      email: googlePayload.email || null,
      avatar_url: googlePayload.picture || null,
    });

    // 4. Issue OUR OWN JWT — this is what protects all protected routes
    // Only include internal user ID (never google_id or email unless needed)
    const appToken = jwt.sign(
      { id: user.id }, // Critical: only internal UUID
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "7d", // Long-lived for good UX (no refresh tokens as per spec)
        algorithm: "HS256", // Explicit for clarity
      }
    );

    // 5. Redirect to frontend with token in query param
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
    const encodedToken = encodeURIComponent(appToken); // Safe for URL

    return res.redirect(
      302,
      `${frontendUrl}/auth/callback?token=${encodedToken}`
    );
  } catch (err) {
    console.error(
      "[AuthController] handleGoogleCallback error:",
      err.message || err
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
    return res.redirect(`${frontendUrl}/login?error=auth_failed`);
  }
}

// Export as default if using import default, or named if preferred
export default {
  redirectToGoogle,
  handleGoogleCallback,
};
