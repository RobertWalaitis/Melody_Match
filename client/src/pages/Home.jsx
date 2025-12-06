import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to Melody Match</h1>
      <h2>Hello, {username}!</h2>

      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => navigate("/profile-settings")}>
          Profile Settings
        </button>

        <br /><br />

        <button onClick={() => navigate("/liked")}>
          Liked Songs
        </button>

        <br /><br />

        <button onClick={() => navigate("/search")}>
          Song Search
        </button>

        <br /><br />

        {username === "ADMIN" && (
          <button onClick={() => navigate("/see-all")}>
            See All Profiles (Admin)
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;