// server/seed.js
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { initDB } from "./db.js";

async function seed() {
  const db = await initDB();

  await db.exec("PRAGMA foreign_keys = ON;"); // enforce FKs

  // Helper to read CSV
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

  try {
    // Profiles
    const profiles = await readCSV(path.join("data", "profiles.csv"));
    for (const p of profiles) {
      await db.run("INSERT INTO Profile (name, password) VALUES (?, ?)", [
        p.name,
        p.password,
      ]);
    }
    console.log("Profiles inserted.");

    // Songs
    const songs = await readCSV(path.join("data", "songs.csv"));
    for (const s of songs) {
      await db.run(
        "INSERT INTO Song (title, length, genre, artist) VALUES (?, ?, ?, ?)",
        [s.title, parseInt(s.length), s.genre, s.artist]
      );
    }
    console.log("Songs inserted.");

    // Liked
    const liked = await readCSV(path.join("data", "liked.csv"));
    for (const l of liked) {
      await db.run(
        "INSERT INTO Liked (liked_song_id, profile_user_id) VALUES (?, ?)",
        [parseInt(l.liked_song_id), parseInt(l.profile_user_id)]
      );
    }
    console.log("Liked songs inserted.");

    console.log("Database seeding completed!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seed();