module.exports = function (db) {
  const express = require("express");
  const router = express.Router();

    async function getUserLikedArtists(db, user_id) {
      const rows = await db.all(
        `SELECT DISTINCT artist
         FROM Song
         JOIN Liked ON Song.song_id = Liked.liked_song_id
         WHERE Liked.profile_user_id = ?`,
        [user_id]
      );
      return rows.map(r => r.artist.toLowerCase());
    }
    
    function weightedRandomPick(songs, likedArtists, limit = 10) {
      const weighted = [];
    
      songs.forEach(song => {
        const isLikedArtist = likedArtists.includes(song.artist.toLowerCase());
        const weight = isLikedArtist ? 3 : 1;
    
        for (let i = 0; i < weight; i++) {
          weighted.push(song);
        }
      });
    
      const result = [];
      const used = new Set();
    
      while (result.length < limit && weighted.length > 0) {
        const randomIndex = Math.floor(Math.random() * weighted.length);
        const choice = weighted[randomIndex];
    
        if (!used.has(choice.song_id)) {
          result.push(choice);
          used.add(choice.song_id);
        }
    
        weighted.splice(randomIndex, 1);
      }
    
      return result;
    }

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
        const user_id = req.query.user_id;   // REQUIRED for weighting

        try {
            // Step 1: fetch songs that match
            const songs = await db.all(
            `SELECT * FROM Song WHERE title LIKE ?`,
            [`%${title}%`]
            );

            if (songs.length === 0) return res.json([]);

            // Step 2: get artists user already likes
            const likedArtists = user_id
            ? await getUserLikedArtists(db, user_id)
            : [];

            // Step 3: apply weighted random selection
            const finalSongs = weightedRandomPick(songs, likedArtists, 10);

            res.json(finalSongs);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Search by title failed" });
        }
    });

    router.get("/search/artist/:artist", async (req, res) => {
        const { artist } = req.params;
        const user_id = req.query.user_id;

        try {
            const songs = await db.all(
            `SELECT * FROM Song WHERE artist LIKE ?`,
            [`%${artist}%`]
            );

            const likedArtists = user_id
            ? await getUserLikedArtists(db, user_id)
            : [];

            const finalSongs = weightedRandomPick(songs, likedArtists, 10);

            res.json(finalSongs);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Search by artist failed" });
        }
    });

    router.get("/search/length", async (req, res) => {
        const { comparison, value, user_id } = req.query;

        try {
            const songs = await db.all(
            `SELECT * FROM Song WHERE song_length ${comparison} ?`,
            [Number(value)]
            );

            const likedArtists = user_id
            ? await getUserLikedArtists(db, user_id)
            : [];

            const finalSongs = weightedRandomPick(songs, likedArtists, 10);

            res.json(finalSongs);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Search by length failed" });
        }
    });

    return router;
}