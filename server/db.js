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

// Ensure /data exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

function trimRow(row) {
    const clean = {};
    for (const key in row) {
        clean[key.trim()] = String(row[key]).trim();
    }
    return clean;
}

// Load a CSV file
export async function loadCSV(filename) {
    const filePath = path.join(dataDir, filename);

    return new Promise((resolve, reject) => {
        const rows = [];
        if (!fs.existsSync(filePath)) return resolve([]);

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => rows.push(trimRow(row)))
            .on("end", () => resolve(rows))
            .on("error", reject);
    });
}

// RESET + RESEED DATABASE
async function resetAndSeed(db) {
    console.log("Resetting database...");

    // Delete all data (foreign keys ON)
    await db.run("DELETE FROM Liked");
    await db.run("DELETE FROM Song");
    await db.run("DELETE FROM Profiles");

    console.log("Inserting seed data...");

    // Seed Profiles
    const profiles = await loadCSV("profiles.csv");
    for (const p of profiles) {
        await db.run(
            `INSERT INTO Profiles (profile_id, profile_name, profile_password)
             VALUES (?, ?, ?)`,
            [
                Number(p.profile_id),
                p.profile_name,
                p.profile_password
            ]
        );
    }

    // Seed Songs
    const songs = await loadCSV("songs.csv");
    for (const s of songs) {
        await db.run(
            `INSERT INTO Song (song_id, title, song_length, artist, genre, release_year)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                Number(s.song_id),
                s.title,
                Number(s.song_length),
                s.artist,
                s.genre,
                Number(s.release_year)
            ]
        );
    }

    // Seed Liked
    const liked = await loadCSV("liked.csv");
    for (const l of liked) {
        await db.run(
            `INSERT INTO Liked (liked_song_id, profile_user_id)
             VALUES (?, ?)`,
            [
                Number(l.liked_song_id),
                Number(l.profile_user_id)
            ]
        );
    }

    console.log("Database reset & reseed complete!");
}

export async function initDB() {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Load schema
    const schema = fs.readFileSync(setupPath, "utf8");
    await db.exec(schema);

    // Force reset + reseed every time
    await resetAndSeed(db);

    return db;
}