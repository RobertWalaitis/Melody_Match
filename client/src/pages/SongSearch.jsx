import React, { useState } from "react";
import { searchSongsByTitle } from "../api";
import { useNavigate } from "react-router-dom";

function SongSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function handleSearch() {
    if (!query) {
      setMsg("Please enter a song name");
      return;
    }
    try {
      const songs = await searchSongsByTitle(query);
      if (songs.length === 0) setMsg("No songs found");
      else setMsg("");
      setResults(songs);
    } catch (err) {
      setMsg(err.message || "Search failed");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Search Songs</h1>
      <input
        placeholder="Enter song name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch} style={{ marginLeft: "0.5rem" }}>
        Search
      </button>

      {msg && <p>{msg}</p>}

      <ul>
        {results.map((song) => (
          <li key={song.song_id}>
            {song.title} by {song.artist} ({song.genre}, {song.song_length}s)
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => navigate("/")}>Back to Home</button>
        <button onClick={() => navigate("/profile")} style={{ marginLeft: "1rem" }}>
          Profile Settings
        </button>
      </div>
    </div>
  );
}

export default SongSearch;
