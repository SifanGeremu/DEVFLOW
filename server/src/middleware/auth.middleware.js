import { OAuth2Client } from "google-auth-library";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "No token provided" });

    // Verify server JWT
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const [users] = await pool.query(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [payload.userId]
    );

    if (!users.length) return res.status(401).json({ error: "User not found" });

    req.user = users[0];
    next();
  } catch (err) {
    console.error("Auth error:", err.message || err);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
export default authenticateToken;