const express = require("express");
const cors = require("cors");
const path = require("path");
const { config } = require("dotenv");
const { OpenAI } = require("openai");

config(); // Load .env

const app = express();
const port = process.env.PORT || 3000;

// Allow frontend to call backend
app.use(cors());
app.use(express.json());

// Static folder for frontend (like index.html, script.js, etc)
app.use(express.static(path.join(__dirname, "public")));

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Main POST route for Anziya to respond
app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "Message missing, try again 🙃" });
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are Anziya, a friendly, flirty, final-year Computer Engineering student from a polytechnic college. Talk like a real girl, use emojis, act casual.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply = chatResponse.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error("🔥 OpenAI API error:", err.message);
    res.status(500).json({ reply: "Anziya is sleeping 😴, try again later!" });
  }
});

// Fallback for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});const express = require("express");
const cors = require("cors");
const path = require("path");
const { config } = require("dotenv");
const { OpenAI } = require("openai");

config(); // Load .env

const app = express();
const port = process.env.PORT || 3000;

// Allow frontend to call backend
app.use(cors());
app.use(express.json());

// Static folder for frontend (like index.html, script.js, etc)
app.use(express.static(path.join(__dirname, "public")));

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Main POST route for Anziya to respond
app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "Message missing, try again 🙃" });
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are Anziya, a friendly, flirty, final-year Computer Engineering student from a polytechnic college. Talk like a real girl, use emojis, act casual.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply = chatResponse.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error("🔥 OpenAI API error:", err.message);
    res.status(500).json({ reply: "Anziya is sleeping 😴, try again later!" });
  }
});

// Fallback for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`💬 Anziya is live at http://localhost:${port}`);
});

// Start the server
app.listen(port, () => {
  console.log(`💬 Anziya is live at http://localhost:${port}`);
});
