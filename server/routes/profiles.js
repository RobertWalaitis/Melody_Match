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
        res.json({ success: true, profile_id: result.lastID });
    });

    // Update username only
    router.put("/:id/username", async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, error: "Name is required" });
        }
        await db.run(
            "UPDATE Profiles SET profile_name = ? WHERE profile_id = ?",
            [name, id]
        );
        res.json({ success: true });
    });

    // Update password only
    router.put("/:id/password", async (req, res) => {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, error: "Password is required" });
        }

        await db.run(
            "UPDATE Profiles SET profile_password = ? WHERE profile_id = ?",
            [password, id]
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
        console.log("Login attempt for:", name, "with password:", password);
        const profile = await db.get(
            "SELECT * FROM Profiles WHERE profile_name = ? AND profile_password = ?",
            [name, password]
        );
        if (!profile) return res.status(401).json({ message: "Invalid name or password" });
        console.log("Login successful for profile:", profile);
        res.json( {success: true, profile_id: profile.profile_id});
    });

    return router;
}