import React, { useState } from "react";
import {
  searchSongsByTitle,
  searchSongsByArtist,
  searchSongsByLength,
  searchSongsByGenre,
  searchSongsByReleaseYear
} from "../api";

function SongSearch() {
  const [query, setQuery] = useState("");
  const [lengthValue, setLengthValue] = useState("");
  const [lengthComparison, setLengthComparison] = useState(">");
  const [yearValue, setYearValue] = useState("");
  const [yearComparison, setYearComparison] = useState(">");
  const [searchType, setSearchType] = useState("title");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [likedSongs, setLikedSongs] = useState([]); // keep track of liked songs

  // Fixed genre options
  const genres = [
    "Country",
    "Electronic",
    "Folk",
    "Hip-Hop",
    "Metal",
    "New Wave",
    "Pop Punk",
    "R&B",
    "Rock"
  ];

  const handleSearch = async () => {
    try {
      let songs = [];

      switch (searchType) {
        case "title":
          songs = await searchSongsByTitle(query);
          break;
        case "artist":
          songs = await searchSongsByArtist(query);
          break;
        case "genre":
          songs = await searchSongsByGenre(query);
          break;
        case "length":
          songs = await searchSongsByLength(lengthComparison, lengthValue);
          break;
        case "release_year":
          songs = await searchSongsByReleaseYear(yearComparison, yearValue);
          break;
        default:
          break;
      }

      setResults(songs);
      setError("");
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "Failed to search");
      setResults([]);
    }
  };

  const handleLike = async (songId) => {
    if (!userId) {
      setError("User ID not set. Cannot like song.");
      return;
    }

    try {
      const res = await fetch("/api/liked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, song_id: songId })
      });

      const data = await res.json();
      if (data.success) {
        setLikedSongs([...likedSongs, songId]);
      } else {
        setError("Failed to like song");
      }
    } catch (err) {
      console.error("Error liking song:", err);
      setError("Failed to like song");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Search Songs</h1>

      {/* Dropdown to choose search type */}
      <label>
        Search By:{" "}
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="artist">Artist</option>
          <option value="genre">Genre</option>
          <option value="length">Length</option>
          <option value="release_year">Release Year</option>
        </select>
      </label>

      <br /><br />

      {/* Search by Title or Artist */}
      {(searchType === "title" || searchType === "artist") && (
        <input
          placeholder={
            searchType === "title" ? "Enter song title" : "Enter artist name"
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}

      {/* Search by Genre (dropdown) */}
      {searchType === "genre" && (
        <select
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        >
          <option value="">--Select a genre--</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      )}

      {/* Search by Length */}
      {searchType === "length" && (
        <div>
          <select
            value={lengthComparison}
            onChange={(e) => setLengthComparison(e.target.value)}
          >
            <option value=">">Greater than</option>
            <option value="<">Less than</option>
            <option value="=">Equal to</option>
          </select>

          <input
            type="number"
            placeholder="Length in seconds"
            value={lengthValue}
            onChange={(e) => setLengthValue(e.target.value)}
            style={{ marginLeft: "1rem" }}
          />
        </div>
      )}

      {/* Search by Release Year */}
      {searchType === "release_year" && (
        <div>
          <select
            value={yearComparison}
            onChange={(e) => setYearComparison(e.target.value)}
          >
            <option value=">">After</option>
            <option value="<">Before</option>
            <option value="=">Equal to</option>
          </select>

          <input
            type="number"
            placeholder="Enter release year"
            value={yearValue}
            onChange={(e) => setYearValue(e.target.value)}
            style={{ marginLeft: "1rem" }}
          />
        </div>
      )}

      <br />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {results.map((song) => (
          <li key={song.song_id} style={{ marginBottom: "0.5rem" }}>
            {song.title} — {song.artist} ({song.release_year}) ({song.song_length}s) | {song.genre}
            {"  "}
            <button
              disabled={likedSongs.includes(song.song_id)}
              onClick={() => handleLike(song.song_id)}
              style={{ marginLeft: "1rem" }}
            >
              {likedSongs.includes(song.song_id) ? "Liked" : "Like"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SongSearch;