import express from "express";
import cors from "cors";
import { initDB } from "./db.js";

import profileRoutes from "./routes/profiles.js";
import songRoutes from "./routes/song.js";
import likedRoutes from "./routes/liked.js";

const app = express();
app.use(cors());
app.use(express.json());

let db;

(async () => {
    db = await initDB();
    await db.exec("PRAGMA foreign_keys = ON;");
    console.log("Database ready with seeded CSV data.");

    // Mount API routes
    app.use("/api/profiles", profileRoutes(db));
    app.use("/api/song", songRoutes(db));
    app.use("/api/like", likedRoutes(db));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})();