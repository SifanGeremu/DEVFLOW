// /utils/prompt.utils.js  (or wherever buildAiPrompt lives — you imported it)

function buildAiPrompt(userProfile) {
  const {
    skill_level = "beginner",
    tech_stack = [], // default to empty array
    daily_time = 60,
    goal_type = "learn",
    duration_weeks = 2,
  } = userProfile || {};

  // Safely handle tech_stack: ensure it's an array
  let techStackStr = "not specified";
  if (Array.isArray(tech_stack) && tech_stack.length > 0) {
    techStackStr = tech_stack.join(", ");
  } else if (typeof tech_stack === "string") {
    // In case it's accidentally stored as JSON string in DB
    try {
      const parsed = JSON.parse(tech_stack);
      if (Array.isArray(parsed)) {
        techStackStr = parsed.join(", ");
      }
    } catch (e) {
      techStackStr = tech_stack; // use as-is if not JSON
    }
  }

  const prompt = `
You are an expert software engineering mentor.

Your task is to generate a personalized learning roadmap for a user.

You MUST follow all rules strictly.

USER PROFILE:
- Skill Level: ${skill_level}
- Tech Stack: ${techStackStr}
- Daily Available Time (minutes): ${daily_time}
- Goal Type: ${goal_type}
- Timeline (weeks): ${duration_weeks}

RULES:
- Return ONLY valid JSON
- Do NOT include explanations, comments, or markdown
- Do NOT include text outside the JSON
- The output MUST match the provided JSON schema exactly
- Tasks must be realistic and directly related to the user’s tech stack
- Do NOT include frontend tasks if the tech stack is backend-only
- Do NOT invent technologies not listed in the tech stack


TASK RULES:
- Each task must take at least 15 minutes
- Task duration should not exceed the user's daily available time (${daily_time} minutes)
- If a task would take longer, break it into multiple smaller tasks
- Task types allowed: "learn", "build", "revise"
- Tasks must be ordered in the correct execution sequence

STRUCTURE RULES:
- Total days = ${duration_weeks} * 7
- day_number starts at 1 and increments by 1
- No skipped or duplicated days

JSON SCHEMA:
{
  "title": "string",
  "goal_type": "learn | build",
  "duration_weeks": number,
  "days": [
    {
      "day_number": number,
      "tasks": [
        {
          "title": "string",
          "description": "string",
          "type": "learn | build | revise",
          "estimated_minutes": number
        }
      ]
    }
  ]
}
`.trim();

  return prompt;
}

export default buildAiPrompt;
