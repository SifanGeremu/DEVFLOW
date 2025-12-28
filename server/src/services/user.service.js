import pool from "../config/db.js";

export const getUserById = async (userId) => {
  const userQuery = `
    SELECT id, email, name, avatar_url, skill_level, tech_stack, daily_time, goal_type, target_timeline, profile_complete
    FROM users 
    WHERE id = ?
  `;
  const [rows] = await pool.execute(userQuery, [userId]);
  return rows[0];
};

export const profileData = async (userId, profileData) => {
  const fields = [];
  const values = [];

  for (const key in profileData) {
    if (profileData[key] !== undefined) {
      let value = profileData[key];

      // Convert arrays/objects to JSON string
      if (typeof value === "object") {
        value = JSON.stringify(value);
      }

      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  // Update user profile fields
  const updateQuery = `
    UPDATE users 
    SET ${fields.join(", ")} 
    WHERE id = ?
  `;
  values.push(userId);
  await pool.execute(updateQuery, values);

  // Fetch updated user
  const updatedUser = await getUserById(userId);

  // Check if onboarding is complete
  const isComplete =
    updatedUser.skill_level &&
    updatedUser.tech_stack &&
    updatedUser.daily_time &&
    updatedUser.goal_type &&
    updatedUser.target_timeline;

  // Update profile_complete flag
  await pool.execute(`UPDATE users SET profile_complete = ? WHERE id = ?`, [
    isComplete ? 1 : 0,
    userId,
  ]);

  // Return updated user again (with profile_complete)
  return getUserById(userId);
};
