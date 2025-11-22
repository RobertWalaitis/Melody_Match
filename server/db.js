import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import csv from 'csv-parser';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.sqlite');

export async function initDB() {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });
    const setupPath = path.join(process.cwd(), 'setup.sql');
    if (fs.existsSync(setupPath)) {
        const setupSQL = fs.readFileSync(setupPath, 'utf8');
        await db.exec(setupSQL);
    } else {
        console.warn("Warning: setup.sql not found, skipping schema setup.");
    }

    return db;
}

export function loadCSV(filename) {
    const filePath = path.join(dataDir, filename);

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) return resolve([]);

        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', row => results.push(row))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

export function saveCSV(filename, data) {
    const filePath = path.join(dataDir, filename);

    if (data.length === 0) {
        throw new Error("saveCSV() requires a non-empty array.");
    }

    const keys = Object.keys(data[0]);
    const lines = [keys.join(',')];

    for (const row of data) {
        lines.push(keys.map(k => row[k]).join(','));
    }

    fs.writeFileSync(filePath, lines.join('\n'));
}

export function appendToCSV(filename, row) {
    const filePath = path.join(dataDir, filename);

    const isNew = !fs.existsSync(filePath);
    if (isNew) {
        fs.writeFileSync(filePath, Object.keys(row).join(',') + '\n');
    }

    fs.appendFileSync(filePath, Object.values(row).join(',') + '\n');
}

export default {
    initDB,
    loadCSV,
    saveCSV,
    appendToCSV
};