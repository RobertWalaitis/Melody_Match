import React, { useState } from "react";
import { login, createProfile } from "../api";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin() {
    const res = await login(name, password);
    if (!res.success) {
      setMessage("Invalid name or password");
    } else {
      localStorage.setItem("profile_id", res.profile.profile_id);
      navigate("/profile-settings");
    }
  }

  async function handleCreate() {
    const res = await createProfile(name, password);
    if (res.success) {
      setMessage("Profile created! You can now sign in.");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to Melody Match</h1>

      <div style={{ marginTop: "1rem" }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button onClick={handleLogin}>Sign In</button>
        <button onClick={handleCreate} style={{ marginLeft: "1rem" }}>
          Create Profile
        </button>
      </div>

      {message && <p style={{ color: "blue" }}>{message}</p>}

      <br />
      <button onClick={() => navigate("/search")}>Search Songs</button>
    </div>
  );
}

export default Home;