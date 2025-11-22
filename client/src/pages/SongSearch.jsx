// src/pages/SongSearch.jsx
import React, { useState } from "react";
import { searchSongsByTitle } from "../api";

function SongSearch() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) {
      setError("Please enter a song title");
      setSongs([]);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const results = await searchSongsByTitle(query.trim());
      setSongs(results);
      if (results.length === 0) {
        setError("No songs found");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search songs. See console for details.");
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Search Songs</h1>

      <input
        type="text"
        placeholder="Enter song title"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ marginRight: "1rem", padding: "0.5rem", width: "300px" }}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ marginTop: "1rem" }}>
        {songs.map((song) => (
          <li key={song.song_id}>
            <strong>{song.title}</strong> by {song.artist} - {song.genre} ({song.song_length}s)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SongSearch;