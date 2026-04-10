export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not set in Vercel environment variables" });

  try {
    const { messages, system } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const geminiContents = [
      { role: "user", parts: [{ text: system || "" }] },
      { role: "model", parts: [{ text: "Understood. I will answer questions about Redwan based on the information provided." }] },
    ];

    for (const msg of messages) {
      geminiContents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    // Try models in order until one works
    const models = ["gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-pro"];
    let response, responseData;

    for (const model of models) {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: geminiContents,
            generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
          }),
        }
      );

      const text = await response.text();
      try { responseData = JSON.parse(text); } catch { continue; }

      if (response.ok) break; // success, stop trying
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: responseData?.error?.message || "Gemini API error",
      });
    }

    const reply = responseData.candidates?.[0]?.content?.parts?.[0]?.text
      || "Sorry, I couldn't generate a response.";

    return res.status(200).json({
      content: [{ type: "text", text: reply }],
    });

  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
