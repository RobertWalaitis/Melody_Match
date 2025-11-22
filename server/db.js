import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import csv from "csv-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "database.sqlite");
const setupPath = path.join(__dirname, "setup.sql");

// Ensure /data exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Load a CSV file
export function loadCSV(filename) {
    const filePath = path.join(dataDir, filename);

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) return resolve([]);

        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", row => results.push(row))
            .on("end", () => resolve(results))
            .on("error", reject);
    });
}

// Seed database only if empty
async function seedDB(db) {
    console.log("Checking if seeding is needed…");

    const existingProfiles = await db.all("SELECT * FROM Profiles");
    if (existingProfiles.length > 0) {
        console.log("Database already seeded. Skipping.");
        return;
    }

    console.log("Seeding database from CSV files…");

    // Profiles
    const profiles = await loadCSV("profiles.csv");
    for (const p of profiles) {
        await db.run(
            "INSERT INTO Profiles (profile_id, profile_name, profile_password) VALUES (?, ?, ?)",
            [p.profile_id, p.name, p.password]
        );
    }

    // Songs
    const songs = await loadCSV("songs.csv");
    for (const s of songs) {
        await db.run(
            "INSERT INTO Song (song_id, title, song_length, genre, artist) VALUES (?, ?, ?, ?, ?)",
            [s.song_id, s.title, Number(s.song_length), s.genre, s.artist]
        );
    }

    // Liked
    const liked = await loadCSV("liked.csv");
    for (const l of liked) {
        await db.run(
            "INSERT INTO Liked (liked_song_id, profile_user_id) VALUES (?, ?)",
            [Number(l.liked_song_id), Number(l.profile_user_id)]
        );
    }

    console.log("Database seeding complete.");
}

// Initialize DB
export async function initDB() {
    console.log("Opening SQLite database at:", dbPath);

    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Setup schema
    if (fs.existsSync(setupPath)) {
        const schema = fs.readFileSync(setupPath, "utf8");
        await db.exec(schema);
    } else {
        console.error("setup.sql not found!");
    }

    // Seed if empty
    await seedDB(db);

    return db;
}