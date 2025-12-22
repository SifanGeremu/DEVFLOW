// /services/aiService.js

/**
 * callAI - Calls Groq API (Llama 3.3 70B or similar)
 * @param {string} prompt - Strict prompt for AI
 * @returns {Object} - Parsed JSON from AI
 */
async function callAI(prompt) {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // fast, good at structured JSON
          messages: [
            {
              role: "system",
              content: "You are an AI mentor that outputs strict JSON.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0, // deterministic output
          max_tokens: 4096, // adjust if needed
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const aiText = data.choices[0].message.content.trim();

    // Parse JSON safely
    let aiJson;
    try {
      aiJson = JSON.parse(aiText);
    } catch (err) {
      console.error("AI returned invalid JSON:", aiText);
      throw new Error("AI returned invalid JSON");
    }

    return aiJson;
  } catch (err) {
    console.error("AI service error:", err.message);
    throw err; // let caller handle retries
  }
}

export default { callAI };
