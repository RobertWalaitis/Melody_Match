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

    return router;
}