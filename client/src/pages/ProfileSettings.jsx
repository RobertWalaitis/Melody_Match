import React, { useState } from "react";
import { updateProfile } from "../api";
import { useNavigate } from "react-router-dom";

function ProfileSettings() {
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const [newName, setNewName] = useState("");
  const [msg, setMsg] = useState("");

  if (!user_id) {
    return <p>You are not logged in.</p>;
  }

  async function handleUpdate() {
    const res = await updateProfile(user_id, newName);
    if (res.success) {
      setMsg("Name updated successfully");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Profile Settings</h1>
      <input
        placeholder="New Name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <button onClick={handleUpdate}>Update Name</button>

      {msg && <p>{msg}</p>}

      <br /><br />
      <button onClick={() => navigate("/")}>Back to Home</button>
      <button onClick={() => navigate("/search")} style={{ marginLeft: "1rem" }}>
        Search Songs
      </button>
    </div>
  );
}

export default ProfileSettings;