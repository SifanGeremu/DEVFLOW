// src/routes/auth.routes.js
import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import pool from "../config/db.js"; 

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /auth/google
router.post("/google", async (req, res) => {
  const { credential } = req.body; // Google ID token from frontend

  if (!credential) {
    return res.status(400).json({ error: "Missing credential" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: google_id, name, email, picture } = payload;

    // Find or create user
    const [rows] = await pool.query("SELECT * FROM User WHERE google_id = ?", [
      google_id,
    ]);
    let user = rows[0];

    if (!user) {
      const [result] = await pool.query(
        "INSERT INTO User (google_id, name, email, profile_picture) VALUES (?, ?, ?, ?)",
        [google_id, name, email, picture]
      );
      user = {
        id: result.insertId,
        google_id,
        name,
        email,
        profile_picture: picture,
      };
    }

    // Issue JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2m",
    });

    res.json({ jwt: token, user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid Google token" });
  }
});

// Add /auth/logout (just message, client deletes token)
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

export default router;
