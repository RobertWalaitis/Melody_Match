import React, { useState } from "react";

function TextPage() {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Text Page</h1>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Type something..."
        style={{ padding: "10px", fontSize: "16px", width: "300px" }}
      />
      <p style={{ marginTop: "20px" }}>You typed: {text}</p>
    </div>
  );
}

export default TextPage;