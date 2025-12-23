// backend/index.js  (CommonJS style)
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple test route
app.get("/", (req, res) => {
  res.send("ResumeAI backend is running");
});

// AI suggestion route
app.post("/api/suggest", async (req, res) => {
  try {
    const { section, text } = req.body; // section = "summary", "experience", etc.

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "No text provided" });
    }

    const prompt = `
You are a professional resume writer.

Task:
- Improve the user's ${section} section for a software developer resume.
- Make it concise, strong, and ATS-friendly.
- Use clear bullet points only when appropriate.
- Do NOT add fake technologies or jobs.

Original ${section}:
${text}

Return only the improved ${section} text.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const suggestion = completion.choices[0].message.content;
    res.json({ suggestion });
  } catch (err) {
    console.error("AI error:", err.message || err);
    res.status(500).json({ error: "Failed to generate suggestion" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
