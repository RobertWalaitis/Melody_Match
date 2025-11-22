import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const goToTextPage = () => {
    navigate("/text");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>HOMEPAGE</h1>
      <button
        onClick={goToTextPage}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "20px"
        }}
      >
        Go to Text Page
      </button>
    </div>
  );
}

export default Home;