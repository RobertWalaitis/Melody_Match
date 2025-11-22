import express from "express";
import cors from "cors";
import { initDB } from "./db.js";

import profileRoutes from "./routes/profile.js";
import songRoutes from "./routes/song.js";
import likedRoutes from "./routes/liked.js";

import fs from "fs";
import path from "path";
import csv from "csv-parser";

const app = express();
app.use(cors());
app.use(express.json());

let db;

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

async function seedDatabase(db) {
  // Optional: clear tables first
  await db.run("DELETE FROM Liked");
  await db.run("DELETE FROM Song");
  await db.run("DELETE FROM Profile");

  // Profiles
  const profiles = await readCSV(path.join("data", "profiles.csv"));
  for (const p of profiles) {
    await db.run("INSERT INTO Profile (name, password) VALUES (?, ?)", [
      p.name,
      p.password,
    ]);
  }

  // Songs
  const songs = await readCSV(path.join("data", "songs.csv"));
  for (const s of songs) {
    await db.run(
      "INSERT INTO Song (title, length, genre, artist) VALUES (?, ?, ?, ?)",
      [s.title, parseInt(s.length), s.genre, s.artist]
    );
  }

  // Liked
  const liked = await readCSV(path.join("data", "liked.csv"));
  for (const l of liked) {
    await db.run(
      "INSERT INTO Liked (liked_song_id, profile_user_id) VALUES (?, ?)",
      [parseInt(l.liked_song_id), parseInt(l.profile_user_id)]
    );
  }

  console.log("Database seeded from CSV files.");
}

(async () => {
  db = await initDB();
  await db.exec("PRAGMA foreign_keys = ON;");
  console.log("Database ready.");

  // Seed DB automatically
  await seedDatabase(db);

  // Mount routes
  app.use("/api/profile", profileRoutes(db));
  app.use("/api/song", songRoutes(db));
  app.use("/api/like", likedRoutes(db));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
})();