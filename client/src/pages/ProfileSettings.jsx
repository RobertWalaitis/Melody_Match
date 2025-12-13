import React, { useState } from "react";
import { updateUsername, updatePassword } from "../api"; // new API functions
import { useNavigate } from "react-router-dom";

function ProfileSettings() {
  const navigate = useNavigate();
  const profile_id = localStorage.getItem("profile_id");

  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  if (!profile_id) {
    return <p>You are not logged in.</p>;
  }

  // Update username
  async function handleUpdateName() {
    if (!newName) return setMsg("Name cannot be empty");

    try {
      const res = await updateUsername(profile_id, newName);
      if (res.success) {
        setMsg("Username updated successfully");
        setNewName("");
      } else {
        setMsg("Failed to update username");
      }
    } catch (err) {
      setMsg(err.message);
    }
  }

  // Update password
  async function handleUpdatePassword() {
    if (!newPassword) return setMsg("Password cannot be empty");

    try {
      const res = await updatePassword(profile_id, newPassword);
      if (res.success) {
        setMsg("Password updated successfully");
        setNewPassword("");
      } else {
        setMsg("Failed to update password");
      }
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Profile Settings</h1>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Change Username</h3>
        <input
          placeholder="New Username"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleUpdateName}>Update Name</button>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleUpdatePassword}>Update Password</button>
      </section>

      {msg && <p>{msg}</p>}

      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => navigate("/home")}>Back to Home</button>
        <button onClick={() => navigate("/search")} style={{ marginLeft: "1rem" }}>
          Search Songs
        </button>
      </div>
    </div>
  );
}

export default ProfileSettings;