// src/controllers/auth.controller.js
import {
  buildGoogleAuthUrl,
  exchangeCodeForTokens,
  verifyIdToken,
  findOrCreateUser,
} from "../services/auth.service.js";

async function redirectToGoogle(req, res) {
  try {
    const url = await buildGoogleAuthUrl(); // ← add await
    res.redirect(url);
  } catch (err) {
    console.error("Redirect error:", err);
    res.status(500).json({ error: "Failed to redirect to Google" });
  }
}
async function handleGoogleCallback(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "Missing auth code" });

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);
    if (!tokens?.id_token) throw new Error("Empty id_token from Google");

    // Verify ID token
    const googleUser = await verifyIdToken(tokens.id_token);

    // Find or create user
    const user = await findOrCreateUser(googleUser);

    return res.json({
      success: true,
      message: "User authenticated successfully",
      accessToken: tokens.id_token, // <-- Use Google ID token directly
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url || null,
      },
    });
  } catch (err) {
    console.error(
      "[AuthController] handleGoogleCallback error:",
      err.message || err
    );
    return res.status(401).json({ error: "Google authentication failed" });
  }
}

export default { redirectToGoogle, handleGoogleCallback };
