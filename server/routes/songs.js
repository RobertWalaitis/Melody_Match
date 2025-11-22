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
    router.get("/search", async (req, res) => {
        console.log("Received /search request with query:", req.query);
        try {
            const { title } = req.query;
            if (!title) return res.status(400).json({ error: "Title is required" });

            const songs = await db.all(
            "SELECT * FROM Song WHERE title LIKE ?",
            [`%${title}%`]
            );

            console.log("Songs found:", songs);
            res.json(songs);
        } catch (err) {
            console.error("Error in /search:", err);
            res.status(500).json({ error: err.message });
        }
    });

    return router;
}