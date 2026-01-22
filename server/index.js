import dotenv from "dotenv";
dotenv.config();

import express from "express";
import pool from "./src/config/db.js";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import roadmapRoutes from "./src/routes/roadmap.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
const app = express();
const PORT = process.env.PORT;


app.use(
  cors({
    origin: "https://devflow-puce.vercel.app/",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  }),
);

// Middleware to parse JSON bodies
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Mount routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/api", roadmapRoutes);
app.use("/tasks",taskRoutes);


// Global error handler

app.listen(PORT, () => {
  console.log(`LISTENING ON ${PORT}`);
});

export default app;
