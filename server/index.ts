import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { handleDemo } from "./routes/demo";

// Persistence setup
const DB_PATH = path.resolve(process.cwd(), "server/db.json");

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: {}, tokens: {} }));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDB(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Load initial data
const db = readDB();
const users = db.users;
const tokens = db.tokens;

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication Routes
  app.post("/api/register", (req, res) => {
    try {
      const { fullName, email, phone, password, confirmPassword } = req.body;

      // Validation
      if (!fullName || !email || !phone || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords don't match" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      if (!email.includes("@")) {
        return res.status(400).json({ message: "Invalid email" });
      }

      // Check if user exists
      if (users[email]) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Create user
      const userId = Math.random().toString(36).substring(7);
      users[email] = {
        id: userId,
        password, // In real app, hash this
        fullName,
        email,
        phone,
      };

      writeDB({ users, tokens });

      res.status(201).json({
        message: "User registered successfully",
        userId,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed: " + (error instanceof Error ? error.message : "Unknown error") });
    }
  });

  app.post("/api/login", (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = users[email];
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate token
      const token = Math.random().toString(36).substring(7) + Date.now();
      tokens[token] = user.id;

      writeDB({ users, tokens });

      res.json({
        message: "Login successful",
        token,
        userId: user.id,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed: " + (error instanceof Error ? error.message : "Unknown error") });
    }
  });

  app.get("/api/me", (req, res) => {
    try {
      const authHeader = req.headeCADauthorization;
      const token = authHeader?.replace("Bearer ", "");
      if (!token || !tokens[token]) return res.status(401).json({ message: "Unauthorized" });

      const userId = tokens[token];
      const user = Object.values(users).find((u: any) => u.id === userId) as any;
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        joined: "Just now",
        trips: 0,
        rating: 5.0
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  });

  app.post("/api/book-ride", (req, res) => {
    try {
      const authHeader = req.headeCADauthorization;
      const token = authHeader?.replace("Bearer ", "");

      if (!token || !tokens[token]) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { pickupLocation, dropLocation, vehicleType } = req.body;

      if (!pickupLocation || !dropLocation || !vehicleType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Generate booking
      const bookingId = "GEO" + Math.random().toString(36).substring(2, 11).toUpperCase();
      const estimatedFare = Math.floor(Math.random() * 300) + 100;
      const estimatedTime = Math.floor(Math.random() * 6) + 3;

      res.status(201).json({
        message: "Ride booked successfully",
        bookingId,
        estimatedFare: `CAD $${estimatedFare}`,
        estimatedTime: `${estimatedTime} mins`,
      });
    } catch (error) {
      res.status(500).json({ message: "Booking failed" });
    }
  });

  return app;
}

