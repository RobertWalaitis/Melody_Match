import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { fileURLToPath } from "url";

import { initDB, loadCSV } from "./db.js";
import profileRoutes from "./routes/profiles.js";
import songRoutes from "./routes/song.js";
import likedRoutes from "./routes/liked.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express setup
const app = express();
app.use(cors());
app.use(express.json());

let db;

// Start the server
(async () => {
  db = await initDB();
  await db.exec("PRAGMA foreign_keys = ON;");
  console.log("Database ready.");

  // Mount API routes
  app.use("/api/profile", profileRoutes(db));
  app.use("/api/song", songRoutes(db));
  app.use("/api/like", likedRoutes(db));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})();