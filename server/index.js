import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// GROQ SETUP
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// CHAT ROUTE
app.post("/chat", async (req, res) => {
  try {
    console.log("📩 Request:", req.body);

    const messages = req.body.messages || [];

    if (!messages.length) {
      return res.json({ reply: "Say something 😅" });
    }

    // 🕒 REAL TIME (used only when needed)
    const now = new Date();
    const currentDate = now.toDateString();
    const currentTime = now.toLocaleTimeString();

    // 🔥 AI CALL (STABLE MODEL)
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ stable working model

      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant.

Important:
- Only use the current date (${currentDate}) and time (${currentTime}) IF the user asks about date or time.
- Otherwise, ignore it.

Rules:
- Answer general knowledge questions clearly and correctly
- Be friendly and natural
- Keep answers simple but useful
- Do NOT force unrelated info like date/time into answers
- Avoid saying "I don't know" unless necessary`,
        },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],

      temperature: 0.7,
      max_tokens: 500,
    });

    const reply =
      completion.choices[0]?.message?.content || "No reply";

    return res.json({ reply });

  } catch (error) {
    console.error("❌ FULL ERROR:", error);
    return res.json({ reply: "AI error 😢" });
  }
});

// START SERVER
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});