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
    router.post("/search", async (req, res) => {
        try {
        const { title } = req.body; // read from body
        if (!title) return res.status(400).json({ error: "Title is required" });

        console.log("Searching songs with title:", title);

        const songs = await db.all(
            "SELECT * FROM Song WHERE title LIKE ?",
            [`%${title}%`] // partial match
        );

        console.log("Songs found:", songs);

        res.json(songs); // always return JSON
        } catch (err) {
        console.error("Error in /songs/search:", err);
        res.status(500).json({ error: err.message });
        }
    });

    return router;
}