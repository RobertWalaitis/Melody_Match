import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Welcome to Melody Match</h1>
      <p>Click below to go to the text input page.</p>
      <button
        onClick={() => navigate("/text")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Go to Text Page
      </button>
    </div>
  );
}

export default Home;