import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from './models/user.js'
import Problem from './models/problem.js'
import Progress from './models/progress.js'

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ai-dsa-mentor-zeta.vercel.app"
  ],
  credentials: true,
}));
app.use(express.json());

/* ---------------- MONGODB ---------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

/* ---------------- AUTH MIDDLEWARE ---------------- */
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

/* ---------------- HOME ---------------- */
app.get("/", (req, res) => res.send("API Running"));

/* ---------------- REGISTER ---------------- */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.log("REGISTER ERROR:", error.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

/* ---------------- LOGIN ---------------- */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid email or password" });
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.log("LOGIN ERROR:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
});

/* ---------------- GET PROFILE ---------------- */
app.get("/api/auth/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

/* ---------------- UPDATE PROFILE ---------------- */
app.put("/api/auth/profile", protect, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.log("UPDATE ERROR:", error.message);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

/* ---------------- GET ALL PROBLEMS ---------------- */
app.get("/api/problems", async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch problems" });
  }
});

/* ---------------- GET SINGLE PROBLEM ---------------- */
app.get("/api/problem/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch problem" });
  }
});

/* ---------------- SAVE PROGRESS ---------------- */
app.post("/api/progress/save", protect, async (req, res) => {
  try {
    const { problemId, solved, code, hintLevel } = req.body;
    const existing = await Progress.findOne({ userId: req.user.id, problemId });
    if (existing) {
      existing.solved = solved;
      existing.code = code;
      existing.hintLevel = hintLevel;
      await existing.save();
    } else {
      await Progress.create({ userId: req.user.id, problemId, solved, code, hintLevel });
    }
    res.json({ success: true });
  } catch (error) {
    console.log("SAVE PROGRESS ERROR:", error.message);
    res.status(500).json({ error: "Failed to save progress" });
  }
});

/* ---------------- GET PROGRESS ---------------- */
app.get("/api/progress", protect, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.id });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

/* ---------------- RUN CODE ---------------- */
app.post("/api/run", async (req, res) => {
  try {
    const { code, languageId } = req.body;
    const response = await axios.post(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      { source_code: code, language_id: languageId },
      { headers: { "Content-Type": "application/json" } }
    );
    res.json({
      stdout: response.data.stdout,
      stderr: response.data.stderr,
      compile_output: response.data.compile_output,
      status: response.data.status,
    });
  } catch (error) {
    console.log("RUN CODE ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "Code execution failed" });
  }
});

/* ---------------- AI HINT ---------------- */
app.post("/api/hint", async (req, res) => {
  try {
    const { code, problemTitle, hintLevel = 1 } = req.body;
    const hintInstructions = {
      1: "Give ONE tiny nudge in 2 sentences max. No algorithm names. No code. End with a question.",
      2: "Give a slightly bigger hint in 3 sentences. Mention what type of structure helps. No code.",
      3: "Walk through the full approach in plain English in 4 sentences. No code. End with encouragement.",
    };
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a friendly DSA mentor. NEVER write code. NEVER number hints. Sound like a helpful friend. Rule: ${hintInstructions[hintLevel] || hintInstructions[1]}`,
          },
          {
            role: "user",
            content: `Problem: ${problemTitle}\nCode:\n${code}\nHint level ${hintLevel}/3.`,
          },
        ],
      },
      { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json" } }
    );
    const hint = response.data?.choices?.[0]?.message?.content || "No hint generated.";
    res.json({ hint });
  } catch (error) {
    console.log("HINT ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate hint" });
  }
});

/* ---------------- AI EXPLAIN ---------------- */
app.post("/api/explain", async (req, res) => {
  try {
    const { code, problemTitle } = req.body;
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a DSA teacher. Explain code like a smart friend: plain English, dry run with real numbers, time/space complexity in simple terms. Short paragraphs.",
          },
          {
            role: "user",
            content: `Problem: ${problemTitle}\nCode:\n${code}\nExplain clearly for beginners.`,
          },
        ],
      },
      { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json" } }
    );
    const explanation = response.data?.choices?.[0]?.message?.content || "No explanation available.";
    res.json({ explanation });
  } catch (error) {
    console.log("EXPLAIN ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to explain solution" });
  }
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));