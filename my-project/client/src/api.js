const API_URL = "https://mst-4090-group-11-project-melody-match.onrender.com/api";

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}