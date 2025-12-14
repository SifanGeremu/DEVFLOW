import jwt from "jsonwebtoken";
import db from "../config/db.js"; // your MySQL pool
import dotenv from "dotenv";
dotenv.config();

// Helper to generate JWT
const generateToken = (userId, payload) => {
  return jwt.sign({ userId, ...payload }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });
};

// Main Google callback handler
export const googleCallback = async (req, res) => {
  try {
    const profile = req.user;

    // 1. Extract needed info from Google profile
    const googleId = profile.id;
    const name = profile.displayName;
    const email = profile.emails[0].value;
    const picture = profile.photos?.[0]?.value || null;

    // 2. Check if user exists in DB
    const [rows] = await db.query("SELECT * FROM user WHERE google_id = ?", [
      googleId,
    ]);

    let user;
    if (rows.length > 0) {
      // Existing user
      user = rows[0];
    } else {
      // New user → insert
      const [result] = await db.query(
        "INSERT INTO user (google_id, name, email, profile_picture) VALUES (?, ?, ?, ?)",
        [googleId, name, email, picture]
      );
      // Retrieve the inserted user
      user = {
        id: result.insertId,
        google_id: googleId,
        name,
        email,
        profile_picture: picture,
      };
    }

    // 3. Generate JWT using internal DB id
    const token = generateToken(user.id, {
      name: user.name,
      email: user.email,
    });

    // 4. Send response
    res.json({
      message: "Google login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("Google callback error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const generateToken = (userId, payload) => {
  return jwt.sign({ userId, ...payload }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });
};
