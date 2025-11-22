// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { getProfiles, getSongs, getLikes } from "../api";

function Home() {
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [likes, setLikes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersData, songsData, likesData] = await Promise.all([
          getProfiles(),
          getSongs(),
          getLikes()
        ]);
        console.log("Users:", usersData);
        console.log("Songs:", songsData);
        console.log("Likes:", likesData);
        setUsers(usersData);
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
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.user_id}>
              {user.name} (ID: {user.user_id})
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Songs</h2>
        <ul>
          {songs.map((song) => (
            <li key={song.song_id}>
              {song.title} by {song.artist} - {song.genre} ({song.length}s)
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

export default Home;