import React, { useState } from "react";
import { searchSongsByTitle } from "../api";

function SongSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const songs = await searchSongsByTitle(query);
      setResults(songs);
      setError("");
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "Failed to search");
      setResults([]);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Search Songs</h1>
      <input
        placeholder="Enter song title"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {results.map((song) => (
          <li key={song.song_id}>
            {song.title} by {song.artist} ({song.song_length}s)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SongSearch;