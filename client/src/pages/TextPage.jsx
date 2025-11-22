// src/pages/TextPage.jsx
import React from "react";
import { useLocation } from "react-router-dom";

function TextPage() {
  const location = useLocation();
  const user = location.state?.user; // get user info from navigation state

  if (!user) {
    return <p>No user logged in. Please go back to login.</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to Text Page</h1>
      <p>Hello, {user.name}!</p>
      <p>User ID: {user.user_id}</p>
    </div>
  );
}

export default TextPage;