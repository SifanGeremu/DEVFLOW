// src/middleware/auth.middleware.js

import axios from "axios";
import pool from "../config/db.js";

export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    if (!token.startsWith("ya29.")) {
      return res
        .status(401)
        .json({
          error: "Invalid token type — must be Google access token (ya29...)",
        });
    }

    // Verify with Google
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/tokeninfo",
      { params: { access_token: token } }
    );

    const payload = response.data;

    if (payload.email_verified !== "true") {
      return res.status(401).json({ error: "Email not verified" });
    }

    // Find user
    const [users] = await pool.query(
      "SELECT * FROM users WHERE google_id = ? OR email = ? LIMIT 1",
      [payload.sub, payload.email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = users[0];
    next();
  } catch (err) {
    console.error("Auth error:", err.response?.data || err.message);
    return res
      .status(401)
      .json({ error: "Invalid or expired Google access token" });
  }
}

export default authenticateToken;
