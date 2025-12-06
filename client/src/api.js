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

export async function searchSongsByTitle(title) {
  const res = await fetch(`${API_URL}/songs/search/title/${title}`);
  if (!res.ok) throw new Error("Failed to search by title");
  return res.json();
}

export async function searchSongsByArtist(artist) {
  const res = await fetch(`${API_URL}/songs/search/artist/${artist}`);
  if (!res.ok) throw new Error("Failed to search songs by artist");
  return res.json();
}

export async function searchSongsByLength(comparison, length) {
  const res = await fetch(
    `${API_URL}/songs/search/length?comparison=${comparison}&value=${length}`
  );
  if (!res.ok) throw new Error("Failed to search songs by length");
  return res.json();
}