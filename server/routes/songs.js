import express from "express";

export default function songRoutes(db) {
    const router = express.Router();

    // Get all songs
    router.get("/", async (req, res) => {
        const songs = await db.all("SELECT * FROM Song");
        res.json(songs);
    });

    // Get a single song
    router.get("/:id", async (req, res) => {
        const { id } = req.params;
        const song = await db.get("SELECT * FROM Song WHERE song_id = ?", [id]);
        res.json(song);
    });

    // Search songs by title (exact or partial)
    router.get("/search/title/:title", async (req, res) => {
        const { title } = req.params;

        try {
        const songs = await db.all(
            `SELECT * FROM Song WHERE title LIKE ?`,
            [`%${title}%`]
        );
        res.json(songs);
        } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Search by title failed" });
        }
    });

    router.get("/search/artist/:artist", async (req, res) => {
        const { artist } = req.params;

        try {
        const songs = await db.all(
            `SELECT * FROM Song WHERE artist LIKE ?`,
            [`%${artist}%`]
        );
        res.json(songs);
        } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Search by artist failed" });
        }
    });

    router.get("/search/length", async (req, res) => {
        const { comparison, value } = req.query;

        if (!["<", ">", "="].includes(comparison)) {
        return res.status(400).json({ error: "Invalid comparison operator" });
        }

        if (isNaN(value)) {
        return res.status(400).json({ error: "Length must be a number" });
        }

        try {
        const songs = await db.all(
            `SELECT * FROM Song WHERE song_length ${comparison} ?`,
            [Number(value)]
        );
        res.json(songs);
        } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Search by length failed" });
        }
    });

    return router;
}