import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure a folder for database
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'database.sqlite');

export async function initDB() {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Run schema
    const setupPath = path.join(__dirname, 'setup.sql');
    if (fs.existsSync(setupPath)) {
        const setupSQL = fs.readFileSync(setupPath, 'utf8');
        await db.exec(setupSQL);
    } else {
        console.warn("setup.sql not found, skipping schema setup.");
    }

    // Seed database from CSV
    await seedDB(db);

    return db;
}

// Reads CSV and filters out empty rows
export async function loadCSV(filename) {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) return [];

    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', row => {
                if (Object.values(row).some(v => v !== "" && v !== null)) results.push(row);
            })
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

// Automatic CSV seeding
async function seedDB(db) {
    // Profiles
    const profiles = await loadCSV('profiles.csv');
    for (const p of profiles) {
        await db.run(
            'INSERT INTO Profiles (profile_id, profile_name, profile_password) VALUES (?, ?, ?)',
            [p.profile_id, p.profile_name, p.profile_password]
        );
    }

    // Songs
    const songs = await loadCSV('songs.csv');
    for (const s of songs) {
        await db.run(
            'INSERT INTO Song (song_id, title, song_length, genre, artist) VALUES (?, ?, ?, ?, ?)',
            [s.song_id, s.title, parseInt(s.song_length), s.genre, s.artist]
        );
    }

    // Liked
    const liked = await loadCSV('liked.csv');
    for (const l of liked) {
        await db.run(
            'INSERT INTO Liked (liked_song_id, profile_user_id) VALUES (?, ?)',
            [parseInt(l.liked_song_id), parseInt(l.profile_user_id)]
        );
    }

    console.log('Database seeded from CSVs');
}

export default {
    initDB,
    loadCSV
};