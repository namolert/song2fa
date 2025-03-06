import { useState, useEffect } from "react";
import "./App.css";

const songs = ["Song A", "Song B", "Song C", "Song D", "Song E", "Song F"];

export default function SongAuth() {
  const [setupMode, setSetupMode] = useState(true);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [storedSequence, setStoredSequence] = useState([]);
  const [authAttempt, setAuthAttempt] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const savedSequence = JSON.parse(localStorage.getItem("songSequence"));
    if (savedSequence) {
      setStoredSequence(savedSequence);
      setSetupMode(false);
    }
  }, []);

  const handleSongSelect = (song) => {
    if (setupMode) {
      setSelectedSongs([...selectedSongs, song]);
    } else {
      setAuthAttempt([...authAttempt, song]);
    }
  };

  const handleSetupComplete = () => {
    if (selectedSongs.length > 0) {
      localStorage.setItem("songSequence", JSON.stringify(selectedSongs));
      setStoredSequence(selectedSongs);
      setSelectedSongs([]); // Reset selection
      setSetupMode(false);
    }
  };

  const handleAuthenticate = () => {
    if (JSON.stringify(authAttempt) === JSON.stringify(storedSequence)) {
      setStatus("Authentication Successful!");
    } else {
      setStatus("Authentication Failed. Try Again.");
    }
    setAuthAttempt([]);
  };

  const handleReset = () => {
    localStorage.removeItem("songSequence");
    setSelectedSongs([]);
    setStoredSequence([]);
    setAuthAttempt([]);
    setStatus(null);
    setSetupMode(true);
  };

  return (
    <div className="container">
      <h1>{setupMode ? "Set Up Your Song Sequence" : "Authenticate"}</h1>

      <div className="grid">
        {songs.map((song, index) => (
          <button
            key={index}
            className={`song-button ${
              (setupMode && selectedSongs.includes(song)) || (!setupMode && authAttempt.includes(song))
                ? "selected"
                : ""
            }`}
            onClick={() => handleSongSelect(song)}
          >
            {song}
          </button>
        ))}
      </div>

      {setupMode ? (
        <button className="action-button" onClick={handleSetupComplete}>Save Sequence</button>
      ) : (
        <button className="action-button" onClick={handleAuthenticate}>Authenticate</button>
      )}

      <button className="reset-button" onClick={handleReset}>Reset</button>

      {status && <p className="status-message">{status}</p>}
    </div>
  );
}