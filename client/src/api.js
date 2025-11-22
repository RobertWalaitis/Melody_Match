const API_URL = "https://mst-4090-group-11-project-melody-match.onrender.com/api";

export async function getProfiles() {
  const res = await fetch(`${API_URL}/profiles`);
  if (!res.ok) throw new Error("Failed to fetch profiles");
  return res.json();
}

export async function getSongs() {
  const res = await fetch(`${API_URL}/song`);
  if (!res.ok) throw new Error("Failed to fetch songs");
  return res.json();
}

export async function getLikes() {
  const res = await fetch(`${API_URL}/like`);
  if (!res.ok) throw new Error("Failed to fetch liked songs");
  return res.json();
}

export async function login(name, password) {
  const res = await fetch(`${API_URL}/profiles/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Login failed");
  }
  return res.json();
}