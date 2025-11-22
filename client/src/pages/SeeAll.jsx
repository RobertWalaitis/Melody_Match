// src/pages/SeeAll.jsx
import React, { useEffect, useState } from "react";
import { getProfiles, getSongs, getLikes } from "../api";

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
          getLikes()
        ]);
        console.log("Profiles:", profilesData);
        console.log("Songs:", songsData);
        console.log("Likes:", likesData);
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
      <h1>Homepage</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <section style={{ marginBottom: "2rem" }}>
        <h2>Profiles</h2>
        <ul>
          {profiles.map((profile) => (
            <li key={profile.profile_id}>
              {profile.profile_name} (ID: {profile.profile_id})
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Songs</h2>
        <ul>
          {songs.map((song) => (
            <li key={song.song_id}>
              {song.title} by {song.artist} - {song.genre} ({song.song_length}s)
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Liked Songs</h2>
        <ul>
          {likes.map((like, index) => (
            <li key={index}>
              Song ID: {like.liked_song_id}, User ID: {like.profile_user_id}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default SeeAll;