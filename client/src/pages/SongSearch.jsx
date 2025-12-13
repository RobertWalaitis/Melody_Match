import React, { useState } from "react";
import {
  searchSongsByTitle,
  searchSongsByArtist,
  searchSongsByLength
} from "../api";

function SongSearch() {
  const [query, setQuery] = useState("");
  const [lengthValue, setLengthValue] = useState("");
  const [lengthComparison, setLengthComparison] = useState(">");
  const [searchType, setSearchType] = useState("title");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      let songs = [];

      if (searchType === "title") {
        songs = await searchSongsByTitle(query);
      } 
      else if (searchType === "artist") {
        songs = await searchSongsByArtist(query);
      } 
      else if (searchType === "length") {
        songs = await searchSongsByLength(lengthComparison, lengthValue);
      }

      setResults(songs);
      setError("");
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "Failed to search");
      setResults([]);
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
          <option value="length">Length</option>
        </select>
      </label>

      <br /><br />

      {/* Search by Title or Artist */}
      {(searchType === "title" || searchType === "artist") && (
        <input
          placeholder={
            searchType === "title"
              ? "Enter song title"
              : "Enter artist name"
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
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

      <br />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {results.map((song) => (
          <li key={song.song_id}>
            {song.title} — {song.artist} ({song.release_year}) ({song.song_length}s) | {song.genre}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SongSearch;