import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ProfileSettings from "./pages/ProfileSettings";
import SongSearch from "./pages/SongSearch";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/search" element={<SongSearch />} />
      </Routes>
    </Router>
  );
}

export default App;