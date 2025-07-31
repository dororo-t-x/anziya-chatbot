const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config(); // Loads environment variables from .env

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve HTML, CSS, etc.

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Add this key in Render secrets
});

// 🧠 Route for chatting with Anziya
app.post("/api/message", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Anziya, a 19-year-old girl studying Computer Engineering in a polytechnic college. You are cheerful, sometimes flirty, and use Malayalam slang." },
        { role: "user", content: userMessage }
      ],
    });

    const botReply = response.choices[0].message.content;
    res.json({ response: botReply });

  } catch (err) {
    console.error("🔥 OpenAI Error:", err);
    res.status(500).json({ error: "Anziya crashed! Try again later 😵‍💫" });
  }
});

// 🔊 Server running
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
