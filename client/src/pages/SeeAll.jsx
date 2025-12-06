// src/pages/SeeAll.jsx
import React, { useEffect, useState } from "react";
import { getProfiles, getSongs, getAllLikes } from "../api";

function SeeAll() {
  const [profiles, setProfiles] = useState([]);
  const [songs, setSongs] = useState([]);
  const [likes, setLikes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [profilesData, songsData, likesData] = await Promise.all([
          getProfiles(),
          getSongs(),
          getAllLikes()
        ]);

        setProfiles(profilesData);
        setSongs(songsData);
        setLikes(likesData);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      }
    }

    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>See All (Admin Only)</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* PROFILES */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Profiles</h2>

        {profiles.length === 0 ? (
          <p>No profiles found.</p>
        ) : (
          <ul>
            {profiles.map((profile) => (
              <li key={profile.profile_id}>
                {profile.profile_name} (ID: {profile.profile_id})
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* SONGS */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Songs</h2>

        {songs.length === 0 ? (
          <p>No songs found.</p>
        ) : (
          <ul>
            {songs.map((song) => (
              <li key={song.song_id}>
                {song.title} — {song.artist} ({song.song_length}s)
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* LIKES */}
      <section>
        <h2>All Likes</h2>

        {likes.length === 0 ? (
          <p>No likes found.</p>
        ) : (
          <ul>
            {likes.map((like, index) => (
              <li key={index}>
                User ID: {like.profile_user_id} → Song ID: {like.liked_song_id}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default SeeAll;