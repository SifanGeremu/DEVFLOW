// src/middleware/authenticateToken.js (or wherever it is)

import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify our own server JWT
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Critical fix: use payload.id, NOT payload.userId
    if (!payload.id) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    // Find user by internal UUID
    const [rows] = await pool.query(
      "SELECT id, google_id, name, avatar_url, email, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
      [payload.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach full user object to request
    req.user = rows[0];
    next();
  } catch (err) {
    console.error(
      "[Auth Middleware] Token verification failed:",
      err.message || err
    );
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export default authenticateToken;
