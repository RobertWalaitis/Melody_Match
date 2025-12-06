import express from "express";
import cors from "cors";
import { initDB } from "./db.js";

import profilesRouter from "./routes/profiles.js";
import songRouter from "./routes/songs.js";
import likedRouter from "./routes/liked.js";

async function startServer() {
  const app = express();

  app.use(cors({
    origin: "https://robertwalaitis.github.io",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type"
  }));

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://robertwalaitis.github.io");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    next();
  });

  app.use(express.json());

  try {
    const db = await initDB();
    await db.exec("PRAGMA foreign_keys = ON;");

    // Mount routers
    app.use("/api/profiles", profilesRouter(db));
    app.use("/api/songs", songRouter(db));
    app.use("/api/liked", likedRouter(db));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1); // Exit process if DB init fails
  }
}

// Start the server
startServer();