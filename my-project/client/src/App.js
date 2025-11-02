import React, { useEffect, useState } from "react";
import { getUsers } from "./api";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>My React + Node + MySQL App</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;