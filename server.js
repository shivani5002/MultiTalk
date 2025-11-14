import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static images if needed
app.use("/images", express.static(path.join(__dirname, "public", "images")));

// 🧠 MongoDB connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
  }
};

// 👤 User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

// 📝 Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed });
    await newUser.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: "Signup error", error: err.message });
  }
});

// 🔐 Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});


// 💬 CONTACT FORM MODEL + ROUTE  ✅
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Contact = mongoose.model("Contact", contactSchema);

// POST /api/contact → save contact form details
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    console.log("📩 New contact saved:", name, email);
    res.status(201).json({ success: true, message: "Message saved successfully" });
  } catch (error) {
    console.error("❌ Contact save error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// 🎨 IMAGE GENERATION (Replicate SDXL)
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt)
      return res
        .status(400)
        .json({ success: false, error: "Prompt required" });

    console.log("🖼️ Generating image via Replicate (SDXL):", prompt);

    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version:
          "5c7d5dc4b5c7e36bb7c6a9f8f9b7ec34e02a935e3a0d3ef33dcbf768d06e317b",
        input: {
          prompt,
          width: 1024,
          height: 1024,
          num_inference_steps: 30,
          scheduler: "DPMSolverMultistep",
          guidance_scale: 7,
        },
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let result = response.data;

    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise((r) => setTimeout(r, 2000));
      const check = await axios.get(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
          },
        }
      );
      result = check.data;
    }

    if (result.status === "succeeded") {
      const imageUrl = result.output[0];
      console.log("✅ Image generated:", imageUrl);
      return res.json({ success: true, imageUrl });
    } else {
      console.error("❌ Replicate error:", result);
      throw new Error(result.error || "Replicate failed");
    }
  } catch (error) {
    console.error("❌ Image generation failed:");
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: "Image generation failed",
      details: error.response?.data || error.message,
    });
  }
});

startServer();
