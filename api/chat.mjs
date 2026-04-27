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

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: geminiContents,
          generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
        }),
      }
    );

    const responseText = await response.text();
    let responseData;
    try { responseData = JSON.parse(responseText); }
    catch { return res.status(500).json({ error: "Invalid JSON from Gemini API" }); }

    if (!response.ok) {
      return res.status(response.status).json({
        error: responseData.error?.message || "Gemini API error",
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
