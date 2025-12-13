import express from "express";

export default function likedRoutes(db) {
    const router = express.Router();

    // Get all like songs
    router.get("/", async (req, res) => {
        const liked = await db.all("SELECT * FROM Liked");
        res.json(liked);
    });
    
    // Like a song
    router.post("/", async (req, res) => {
        const { user_id, song_id } = req.body;
        console.log("Liking song with User ID = ", user_id, " and Song ID = ",song_id);
        await db.run(
            "INSERT INTO Liked (liked_song_id, profile_user_id) VALUES (?, ?)",
            [song_id, user_id]
        );
        res.json({ success: true });
    });

    // Get liked songs for a user
    router.get("/:user_id", async (req, res) => {
        const { user_id } = req.params;
        const likedSongs = await db.all(
            `SELECT Song.*
             FROM Liked
             JOIN Song ON Song.song_id = Liked.liked_song_id
             WHERE Liked.profile_user_id = ?`,
            [user_id]
        );
        res.json(likedSongs);
    });

    // Unlike a song
    router.delete("/", async (req, res) => {
        const { user_id, song_id } = req.body;
        await db.run(
            "DELETE FROM Liked WHERE liked_song_id = ? AND profile_user_id = ?",
            [song_id, user_id]
        );
        res.json({ success: true });
    });

    return router;
}