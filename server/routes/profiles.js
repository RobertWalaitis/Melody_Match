import express from "express";

export default function profileRoutes(db) {
    const router = express.Router();

    // Get all profiles
    router.get("/", async (req, res) => {
        const profiles = await db.all("SELECT * FROM Profiles");
        console.log("Sending profiles:", profiles);
        res.json(profiles);
    });

    // Get a single profile
    router.get("/:id", async (req, res) => {
        const { id } = req.params;
        const profile = await db.get("SELECT * FROM Profiles WHERE profile_id = ?", [id]);
        res.json(profile);
    });

    // Create a new profile
    router.post("/", async (req, res) => {
        const { name, password } = req.body;
        const result = await db.run(
            "INSERT INTO Profiles (profile_name, profile_password) VALUES (?, ?)",
            [name, password]
        );
        res.json({ success: true, user_id: result.lastID });
    });

    // Update a profile
    router.put("/:id", async (req, res) => {
        const { id } = req.params;
        const { name, password } = req.body;
        await db.run(
            "UPDATE Profiles SET profile_name = ?, profile_password = ? WHERE profile_id = ?",
            [name, password, id]
        );
        res.json({ success: true });
    });

    // Delete a profile
    router.delete("/:id", async (req, res) => {
        const { id } = req.params;
        await db.run("DELETE FROM Profiles WHERE profile_id = ?", [id]);
        res.json({ success: true });
    });

    // --- LOGIN ROUTE ---
    router.post("/login", async (req, res) => {
        const { name, password } = req.body;
        const user = await db.get(
            "SELECT * FROM Profiles WHERE profile_name = ? AND profile_password = ?",
            [name, password]
        );
        if (!user) return res.status(401).json({ message: "Invalid name or password" });
        res.json(user);
    });

    return router;
}