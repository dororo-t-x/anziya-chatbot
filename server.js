const express = require("express");
const fs = require("fs");
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

app.use(express.static(path.join(__dirname, "public")));

const memoryFile = path.join(__dirname, "memory.json");

function detectEmotion(msg) {
  msg = msg.toLowerCase();
  if (msg.includes("love") || msg.includes("miss")) return "blushing 😳";
  if (msg.includes("angry") || msg.includes("mad")) return "annoyed 😤";
  if (msg.includes("joke") || msg.includes("funny")) return "laughing 😂";
  if (msg.includes("help") || msg.includes("code")) return "focused 🧠";
  return "normal 🙂";
}

function saveMessage(from, text) {
  let history = [];
  try {
    history = JSON.parse(fs.readFileSync(memoryFile));
  } catch (e) {}
  history.push({ from, text, timestamp: new Date() });
  fs.writeFileSync(memoryFile, JSON.stringify(history.slice(-10), null, 2));
}

function getMemoryContext() {
  let history = [];
  try {
    history = JSON.parse(fs.readFileSync(memoryFile));
  } catch (e) {}
  return history.slice(-5).map(entry => ({
    role: entry.from === "Machu" ? "user" : "assistant",
    content: entry.text
  }));
}

app.get("/ask", async (req, res) => {
  const msg = req.query.msg;
  const mood = detectEmotion(msg);
  const context = getMemoryContext();

  const messages = [
    {
      role: "system",
      content: `You're Anziya, a 19-year-old polytechnic girl studying Computer Engineering. You're funny, sweet, a little flirty, and talk in a casual Gen Z tone. You're in a ${mood} mood. You're chatting with Machu, your online bestie.`
    },
    ...context,
    { role: "user", content: msg }
  ];

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages
    });

    const reply = response.data.choices[0].message.content;
    saveMessage("Machu", msg);
    saveMessage("Anziya", reply);
    res.send(reply);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Anziya is feeling shy right now... 😔");
  }
});

app.listen(PORT, () => {
  console.log(`Anziya is live at http://localhost:${PORT}`);
});
