import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import pool from "../config/db.js"; // your MySQL connection
import crypto from "crypto";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Build Google OAuth URL (synchronous)
 */
export function buildGoogleAuthUrl() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: ["openid", "email", "profile"].join(" "),
  };
  return `${rootUrl}?${new URLSearchParams(options).toString()}`;
}

/**
 * Exchange code for tokens
 */
export async function exchangeCodeForTokens(code) {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  };

  try {
    const res = await axios.post(url, new URLSearchParams(values).toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return res.data; // { access_token, id_token, refresh_token, etc. }
  } catch (err) {
    console.error("Token exchange error:", err.response?.data || err.message);
    throw new Error("Failed to exchange code for tokens");
  }
}

/**
 * Verify ID token
 */
export async function verifyIdToken(id_token) {
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload(); // { email, sub, name, picture }
}


/**
 * Find or create user in DB
 */
export async function findOrCreateUser(googleUser) {
  const { sub: google_id, email, name, picture } = googleUser;

  // Find existing
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE google_id = ? OR email = ? LIMIT 1",
    [google_id, email]
  );

  if (rows.length > 0) {
    return rows[0];
  }

  // Generate UUID for id
  const userId = crypto.randomUUID(); // built-in, no extra package needed

  // Insert with explicit id
  const [result] = await pool.query(
    "INSERT INTO users (id, google_id, email, name, avatar_url) VALUES (?, ?, ?, ?, ?)",
    [userId, google_id, email, name || email.split("@")[0], picture || null]
  );

  // Retrieve the new user
  const [newRows] = await pool.query("SELECT * FROM users WHERE id = ?", [
    userId,
  ]);

  if (newRows.length === 0) {
    throw new Error("Failed to retrieve new user");
  }

  return newRows[0];
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
}
