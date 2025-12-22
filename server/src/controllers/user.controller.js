import { getUserById, profileData } from "../services/user.service.js";

// GET /user/profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // comes from JWT middleware

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

// PUT /user/profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const { skill_level, tech_stack, daily_time, goal_type, target_timeline } =
      req.body;

    if (!Object.keys(req.body).length) {
      return res.status(400).json({ message: "No data provided" });
    }

    const updatedUser = await profileData(userId, {
      skill_level,
      tech_stack,
      daily_time,
      goal_type,
      target_timeline,
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
