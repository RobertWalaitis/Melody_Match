import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import csv from "csv-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "database.sqlite");
const setupPath = path.join(__dirname, "setup.sql");


export async function loadCSV(filename) {
    const filePath = path.join(dataDir, filename);

    return new Promise((resolve, reject) => {
        const rows = [];
        if (!fs.existsSync(filePath)) return resolve([]);

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", row => rows.push(row))
            .on("end", () => resolve(rows))
            .on("error", reject);
    });
}

async function seedDB(db) {
    const existing = await db.get("SELECT COUNT(*) AS count FROM Profiles");
    if (existing.count > 0) {
        console.log("Database already seeded.");
        return;
    }

    console.log("Seeding database...");

    // Profiles
    const profiles = await loadCSV("profiles.csv");
    for (const p of profiles) {
        await db.run(
            "INSERT INTO Profiles (profile_id, profile_name, profile_password) VALUES (?, ?, ?)",
            [Number(p.profile_id), p.profile_name, p.profile_password]
        );
    }

    // Song
    const songs = await loadCSV("songs.csv");
    for (const s of songs) {
        await db.run(
            "INSERT INTO Song (song_id, title, song_length, artist) VALUES (?, ?, ?, ?)",
            [Number(s.song_id), s.title, Number(s.song_length), s.artist]
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

    console.log("Seeding complete.");
}

export async function initDB() {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Run schema
    const schema = fs.readFileSync(setupPath, "utf8");
    await db.exec(schema);

    // Seed
    await seedDB(db);

    return db;
}