// /services/roadmapService.js
import buildAiPrompt from "../utils/prompt.utils.js";
import validateAiOutput from "../utils/validateAIOutput.utils.js";
import persistTasks from "../utils/persistTasks.utils.js";
import aiService from "../services/ai.service.js";
import pool from "../config/db.js"; // Add DB pool for update

/**
 * generateRoadmap
 * @param {Object} userProfile - User object from DB
 * @returns {Object} - { roadmap_id, message }
 */
async function generateRoadmap(userProfile) {
  // Check if user already has a roadmap (optional)
  

  // 2 Build AI prompt
  const prompt = buildAiPrompt(userProfile);

  let aiOutput;
  let retryCount = 0;

  while (retryCount < 2) {
    // 1 retry allowed
    try {
      // 3 Call AI
      aiOutput = await aiService.callAI(prompt);

      // 4 Validate AI output
      const { valid, tasks, error } = validateAiOutput(aiOutput, userProfile);

      if (valid) {
        // 5 Persist tasks and AI snapshot
        const result = await persistTasks(tasks, userProfile, aiOutput);

        // -----------------------------
        // 6 Assign today's date to all tasks without scheduled_date
        // -----------------------------
        const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

        if (result.roadmap_id) {
          await pool.query(
            `UPDATE tasks
             SET scheduled_date = ?
             WHERE goal_id = ?
               AND scheduled_date IS NULL`,
            [today, result.roadmap_id]
          );
        }

        return result; // roadmap_id + message
      } else {
        // Invalid AI content → fatal
        throw new Error(`AI output invalid: ${error}`);
      }
    } catch (err) {
      // Retryable errors: AI server down, rate limits, etc.
      retryCount++;
      if (retryCount >= 2) {
        throw new Error("Failed to generate roadmap: " + err.message);
      }
    }
  }
}

export default {
  generateRoadmap,
};
