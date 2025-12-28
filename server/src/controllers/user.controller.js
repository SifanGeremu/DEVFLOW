// src/controllers/user.controller.js

import { getUserById, profileData } from "../services/user.service.js";

// GET /user/profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /user/profile  ← Use PATCH (not PUT) as per REST best practice and spec
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Accept fields using the original DevFlow spec names (frontend-friendly)
    const {
      skill_level,
      tech_stack,
      daily_time_minutes,
      goal_type,
      target_timeline_weeks,
    } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data provided" });
    }

    // Map to your actual database column names
    const dbProfileData = {
      skill_level,
      tech_stack,
      daily_time: daily_time_minutes, // ← maps to DB column 'daily_time'
      goal_type,
      target_timeline: target_timeline_weeks, // ← maps to DB column 'target_timeline'
    };

    // Remove any undefined fields (so we don't overwrite with null accidentally)
    const filteredData = Object.fromEntries(
      Object.entries(dbProfileData).filter(([_, v]) => v !== undefined)
    );

    const updatedUser = await profileData(userId, filteredData);

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
