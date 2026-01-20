// src/controllers/roadmap.controller.js

import roadmapService from "../services/roadmap.service.js";
import pool from "../config/db.js";

async function generateRoadmap(req, res) {
  const user = req.user;

  if (!user || !user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Fetch full user profile from users table (all fields are in users)
    const [profileRows] = await pool.query(
      `SELECT id, skill_level, tech_stack, daily_time, goal_type, target_timeline, profile_complete
       FROM users
       WHERE id = ?`,
      [user.id]
    );

    if (profileRows.length === 0) {
      return res.status(400).json({ error: "User profile not found" });
    }

    const userProfile = profileRows[0];

    // Optional: Check if onboarding is complete (if you have profile_complete field)
    // if (!userProfile.profile_complete) {
    //   return res.status(403).json({ error: "Please complete onboarding first" });
    // }
const result = await roadmapService.generateRoadmap(userProfile);

// Mark onboarding as complete
await pool.query(`UPDATE users SET profile_complete = 1 WHERE id = ?`, [
  user.id,
]);

res.json(result);

    // Pass profile to service
   
  } catch (err) {
    console.error("Generate roadmap error:", err.message);
    res.status(400).json({ error: err.message });
  }
}

async function getTasks(req, res) {
  const user = req.user;

  if (!user || !user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const tasksQuery = `
      SELECT id, title, description, status, order_index, estimated_minutes
      FROM tasks
      WHERE goal_id = (
        SELECT id FROM goals 
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 1
      )
      ORDER BY order_index
    `;

    const [tasks] = await pool.query(tasksQuery, [user.id]);

    res.json({
      roadmap_title: "Your Personalized Roadmap",
      tasks,
    });
  } catch (err) {
    console.error("Fetch tasks error:", err.message);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
}

export default {
  generateRoadmap,
  getTasks,
};
