// /utils/validateAiOutput.js

function validateAiOutput(aiOutput, userProfile) {
  const daily_time = (userProfile && userProfile.daily_time) || 60;

  // ... all your other structure checks ...

  const flattenedTasks = [];
  let order_index = 1;

  if (!aiOutput || !Array.isArray(aiOutput.days)) {
    return {
      valid: false,
      error: "Invalid aiOutput structure: missing days array",
    };
  }

  for (const day of aiOutput.days) {
    if (!day || !Array.isArray(day.tasks)) {
      return {
        valid: false,
        error: "Invalid day object or missing tasks array",
      };
    }

    for (const task of day.tasks) {
      if (!task || typeof task !== "object") {
        return { valid: false, error: "Invalid task object" };
      }

      const { title, description, type, estimated_minutes } = task;

      if (
        typeof title !== "string" ||
        title.trim() === "" ||
        typeof description !== "string" ||
        description.trim() === ""
      ) {
        return { valid: false, error: "Task missing title or description" };
      }

      if (!["learn", "build", "revise"].includes(type)) {
        return { valid: false, error: "Invalid task type" };
      }

      // Duration check — safe destructuring + fallback
      const taskDuration = Number(estimated_minutes);
      if (
        isNaN(taskDuration) ||
        taskDuration < 15 ||
        taskDuration > daily_time
      ) {
        return {
          valid: false,
          error: `Invalid task duration: ${taskDuration} min (must be 15–${daily_time})`,
        };
      }

      flattenedTasks.push({
        title,
        description,
        type,
        estimated_minutes: taskDuration,
        order_index,
      });
      order_index++;
    }
  }

  return { valid: true, tasks: flattenedTasks };
}

export default validateAiOutput;
