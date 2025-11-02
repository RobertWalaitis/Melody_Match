import React, { useState } from "react";

function TextPage() {
  const [text, setText] = useState("");

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Enter Some Text</h1>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
        style={{ padding: "10px", fontSize: "16px", width: "300px" }}
      />
      <p style={{ marginTop: "1rem" }}>
        You typed: <strong>{text}</strong>
      </p>
    </div>
  );
}

export default TextPage;