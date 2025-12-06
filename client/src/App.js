import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ProfileSettings from "./pages/ProfileSettings";
import SongSearch from "./pages/SongSearch";
import LikedSongs from "./pages/LikedSongs.jsx";
import SeeAll from "./pages/SeeAll";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/search" element={<SongSearch />} />
        <Route path="/liked" element={<LikedSongs />} />
        <Route path="/see-all" element={<SeeAll />} />
      </Routes>
    </Router>
  );
}

export default App;