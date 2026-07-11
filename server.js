import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// Check if the API key is set
if (!process.env.GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY is not set in your .env file!");
    process.exit(1); 
}

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// Initialize the client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize the model
// Use this exact line (ensure the prefix "models/" is present)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// Routes
app.post("/api/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("Sending prompt to AI:", prompt); // Added this to see what you are sending
    
    if (!prompt) return res.status(400).json({ error: "No prompt provided." });
    
    const result = await model.generateContent(prompt);
    res.json({ text: result.response.text() });
  } catch (err) {
    console.error("Gemini API error details:", err.message); // This will give us a cleaner error
    res.status(500).json({ error: "Something went wrong talking to the AI." });
  }
});
// Debugging: List available models

app.listen(PORT, () => {
  console.log(`Finance Tracker running at http://localhost:${PORT}`);
});
