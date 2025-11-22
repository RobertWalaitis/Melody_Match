import express from "express";
import cors from "cors";
import { initDB } from "./db.js";

import profileRoutes from "./routes/profile.js";
import songRoutes from "./routes/song.js";
import likedRoutes from "./routes/liked.js";

const app = express();
app.use(cors());
app.use(express.json());

let db;

(async () => {
    db = await initDB();
    await db.exec("PRAGMA foreign_keys = ON;"); // enforce FK
    console.log("Database ready.");

    // Mount routes
    app.use("/profile", profileRoutes(db));
    app.use("/song", songRoutes(db));
    app.use("/like", likedRoutes(db));

    app.listen(3000, () => console.log("Server running on http://localhost:3000"));
})();