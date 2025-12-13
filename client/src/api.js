const API_URL = "https://mst-4090-group-11-project-melody-match.onrender.com/api";

export async function getProfiles() {
  const res = await fetch(`${API_URL}/profiles`);
  if (!res.ok) throw new Error("Failed to fetch profiles");
  return res.json();
}

export async function login(name, password) {
  const res = await fetch(`${API_URL}/profiles/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, password })
  });
  return res.json();
}

export async function createProfile(name, password) {
  const res = await fetch(`${API_URL}/profiles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, password })
  });
  return res.json();
}

export async function updateUsername(id, name) {
  const res = await fetch(`${API_URL}/profiles/${id}/username`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  return res.json();
}

export async function updatePassword(id, password) {
  const res = await fetch(`${API_URL}/profiles/${id}/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });
  return res.json();
}

export async function getSongs() {
  const res = await fetch(`${API_URL}/songs`);
  if (!res.ok) throw new Error("Failed to fetch songs");
  return res.json();
}

export async function searchSongs(query) {
  const res = await fetch(`${API_URL}/songs?title=${encodeURIComponent(query)}`);
  return res.json();
}

export async function getAllLikes() {
  const res = await fetch(`${API_URL}/liked`);
  if (!res.ok) throw new Error("Failed to fetch liked songs");
  return res.json();
}

export async function getLikes(profile_id) {
  const res = await fetch(`${API_URL}/liked/${profile_id}`);
  if (!res.ok) throw new Error("Failed to fetch liked songs");
  return res.json();
}

export async function unlikeSong(user_id, song_id) {
  const res = await fetch(`${API_URL}/liked`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user_id, song_id })
  });

  if (!res.ok) throw new Error("Failed to unlike song");
  return res.json();
}

export async function likeSong(profile_id, song_id) {
  if (!profile_id || !song_id) throw new Error("profile_id and song_id are required");

  const res = await fetch(`${API_BASE}/liked`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile_id: profile_id, song_id: song_id })
  });

  const data = await res.json();
  if (!data.success) throw new Error("Failed to like song");
  return data;
}

const profile_id = localStorage.getItem("profile_id");

export async function searchSongsByTitle(title, profile_id) {
  const res = await fetch(`${API_URL}/songs/search/title?title=${title}&user_id=${profile_id}`);
  return res.json();
}

export async function searchSongsByArtist(artist, profile_id) {
  const res = await fetch(`${API_URL}/songs/search/artist?artist=${artist}&user_id=${profile_id}`);
  return res.json();
}

export async function searchSongsByGenre(genre, profile_id) {
  const res = await fetch(`${API_URL}/songs/search/genre?genre=${genre}&user_id=${profile_id}`);
  return res.json();
}

export async function searchSongsByLength(comparison, value) {
  const res = await fetch(`${API_URL}/songs/search/length?comparison=${comparison}&value=${value}&user_id=${profile_id}`);
  return res.json();
}

export async function searchSongsByReleaseYear(comparison, value) {
  const res = await fetch(`${API_URL}/songs/search/release_year?comparison=${comparison}&value=${value}&user_id=${profile_id}`);
  return res.json();
}