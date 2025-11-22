import React, { useState } from "react";
import { searchSongs } from "../api";
import { useNavigate } from "react-router-dom";

function SongSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);

  async function handleSearch() {
    const results = await searchSongs(query);
    setSongs(results);
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Search for a Song</h1>

      <input
        placeholder="Enter song name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSearch} style={{ marginLeft: "1rem" }}>
        Search
      </button>

      <ul style={{ marginTop: "1rem" }}>
        {songs.map((s) => (
          <li key={s.song_id}>
            {s.title} — {s.artist}
          </li>
        ))}
      </ul>

      <br />
      <button onClick={() => navigate("/")}>Home</button>
      <button onClick={() => navigate("/profile-settings")} style={{ marginLeft: "1rem" }}>
        Profile Settings
      </button>
    </div>
  );
}

export default SongSearch;