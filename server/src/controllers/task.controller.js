import pool from "../config/db.js";

export async function getTodayTasks(req, res, next) {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      `
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.estimated_minutes,
        t.scheduled_date
      FROM tasks t
      JOIN goals g ON g.id = t.goal_id
      WHERE g.user_id = ?
        AND g.status = 'active'
        AND t.scheduled_date = CURDATE()
      ORDER BY t.order_index ASC
      `,
      [userId]
    );

    return res.status(200).json({
      date: new Date().toISOString().split("T")[0],
      tasks: rows,
    });
  } catch (error) {
    next(error);
  }
}


/**
 * Mark a task as completed and update streaks
 */
export async function completeTask(req, res, next) {
  const userId = req.user.id;
  const taskId = req.params.id;

  try {
    // 1 Verify task belongs to user's active goal
    const [taskRows] = await pool.query(
      `
      SELECT t.id, t.status, g.id AS goal_id
      FROM tasks t
      JOIN goals g ON g.id = t.goal_id
      WHERE t.id = ? AND g.user_id = ? AND g.status = 'active'
      `,
      [taskId, userId]
    );

    if (taskRows.length === 0) {
      return res.status(404).json({ error: "Task not found or not allowed" });
    }

    const task = taskRows[0];

    // 2 Idempotency
    if (task.status === "completed") {
      return res.status(200).json({ message: "Task already completed" });
    }

    // 3 Update task status
    await pool.query(
      `UPDATE tasks SET status = 'completed', updated_at = NOW() WHERE id = ?`,
      [taskId]
    );

    // 4 Log activity
    await pool.query(
      `INSERT INTO activity_logs (id, user_id, task_id, action) VALUES (UUID(), ?, ?, ?)`,
      [userId, taskId, "TASK_COMPLETED"]
    );

    // 5 Update streaks
    const today = new Date().toISOString().split("T")[0];

    const [streakRows] = await pool.query(
      `SELECT id, current_streak, longest_streak, last_activity_date
       FROM streaks WHERE user_id = ?`,
      [userId]
    );

    let currentStreak = 1;
    let longestStreak = 1;

    if (streakRows.length === 0) {
      // No streak yet → create
      await pool.query(
        `INSERT INTO streaks (id, user_id, current_streak, longest_streak, last_activity_date)
         VALUES (UUID(), ?, 1, 1, ?)`,
        [userId, today]
      );
    } else {
      const streak = streakRows[0];
      // Only increment if last_activity_date != today
      if (streak.last_activity_date?.toISOString().split("T")[0] !== today) {
        currentStreak = streak.current_streak + 1;
      } else {
        currentStreak = streak.current_streak;
      }
      longestStreak = Math.max(streak.longest_streak, currentStreak);

      await pool.query(
        `UPDATE streaks SET current_streak = ?, longest_streak = ?, last_activity_date = ?
         WHERE id = ?`,
        [currentStreak, longestStreak, today, streak.id]
      );
    }

    // 6 Return success
    res.status(200).json({
      message: "Task completed successfully",
      current_streak: currentStreak,
      longest_streak: longestStreak,
    });
  } catch (err) {
    next(err);
  }
}

export default { getTodayTasks, completeTask };