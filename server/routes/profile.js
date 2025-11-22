import express from "express";

export default function profileRoutes(db) {
    const router = express.Router();

    // Get all profiles
    router.get("/", async (req, res) => {
        const profiles = await db.all("SELECT * FROM Profile");
        res.json(profiles);
    });

    // Get a single profile
    router.get("/:id", async (req, res) => {
        const { id } = req.params;
        const profile = await db.get("SELECT * FROM Profile WHERE user_id = ?", [id]);
        res.json(profile);
    });

    // Create a new profile
    router.post("/", async (req, res) => {
        const { name, password } = req.body;
        const result = await db.run(
            "INSERT INTO Profile (name, password) VALUES (?, ?)",
            [name, password]
        );
        res.json({ success: true, user_id: result.lastID });
    });

    // Update a profile
    router.put("/:id", async (req, res) => {
        const { id } = req.params;
        const { name, password } = req.body;
        await db.run(
            "UPDATE Profile SET name = ?, password = ? WHERE user_id = ?",
            [name, password, id]
        );
        res.json({ success: true });
    });

    // Delete a profile
    router.delete("/:id", async (req, res) => {
        const { id } = req.params;
        await db.run("DELETE FROM Profile WHERE user_id = ?", [id]);
        res.json({ success: true });
    });

    return router;
}