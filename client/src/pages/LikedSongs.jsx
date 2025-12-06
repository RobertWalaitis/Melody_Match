import React, { useEffect, useState } from "react";
import { getLikes, unlikeSong } from "../api";

function LikedSongs() {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");

  const profile_id = localStorage.getItem("profile_id");

  async function loadSongs() {
    try {
      const data = await getLikes(profile_id);
      setSongs(data);
    } catch (err) {
      setError("Failed to load liked songs");
    }
  }

  useEffect(() => {
    loadSongs();
  }, []);

  async function handleUnlike(song_id) {
    try {
      await unlikeSong(profile_id, song_id);
      await loadSongs(); // refresh list
    } catch (err) {
      console.error(err);
      setError("Failed to unlike song");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Your Liked Songs</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {songs.length === 0 ? (
        <p>You haven't liked any songs yet.</p>
      ) : (
        <ul>
          {songs.map((song) => (
            <li key={song.song_id} style={{ marginBottom: "0.75rem" }}>
              <strong>{song.title}</strong> — {song.artist}
              <button
                onClick={() => handleUnlike(song.song_id)}
                style={{
                  marginLeft: "1rem",
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "0.25rem 0.5rem",
                  cursor: "pointer",
                }}
              >
                Unlike
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LikedSongs;