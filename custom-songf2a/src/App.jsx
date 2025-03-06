import { useState, useEffect } from "react";
import "./App.css";

const songs = [
  "Blinding Lights - The Weeknd",
  "Levitating - Dua Lipa",
  "Shape of You - Ed Sheeran",
  "Uptown Funk - Mark Ronson ft. Bruno Mars",
  "Old Town Road - Lil Nas X",
  "Happier Than Ever - Billie Eilish",
  "Rolling in the Deep - Adele",
  "Bad Guy - Billie Eilish",
  "Stay - Justin Bieber & The Kid LAROI",
  "Can't Stop the Feeling! - Justin Timberlake",
  "Dance Monkey - Tones and I",
  "Watermelon Sugar - Harry Styles",
  "Rockstar - DaBaby ft. Roddy Ricch",
  "Savage Love - Jawsh 685 & Jason Derulo",
  "Good 4 U - Olivia Rodrigo",
  "As It Was - Harry Styles",
  "Shallow - Lady Gaga & Bradley Cooper",
  "Don't Start Now - Dua Lipa",
  "Bohemian Rhapsody - Queen",
  "Take Me To Church - Hozier"
];

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
      if (!selectedSongs.includes(song)) {
        setSelectedSongs([...selectedSongs, song]);
      }
    } else {
      setAuthAttempt([...authAttempt, song]);
    }
  };

  const handleSetupComplete = () => {
    if (selectedSongs.length > 0) {
      // Save the selected songs in the original order
      localStorage.setItem("selectedSongs", JSON.stringify(selectedSongs));
      
      // Randomize the selected sequence for authentication
      const randomizedSequence = randomizeSequence(selectedSongs);
      localStorage.setItem("songSequence", JSON.stringify(randomizedSequence));
      
      setStoredSequence(randomizedSequence);
      setSelectedSongs([]);
      setSetupMode(false);
    }
  };

  const handleAuthenticate = () => {
    const originalSequence = JSON.parse(localStorage.getItem("selectedSongs"));
    if (JSON.stringify(authAttempt) === JSON.stringify(originalSequence)) {
      setStatus("Authentication Successful!");
    } else {
      setStatus("Authentication Failed. Try Again.");
    }
    setAuthAttempt([]);
  };

  const handleReset = () => {
    localStorage.removeItem("songSequence");
    localStorage.removeItem("selectedSongs");
    setSelectedSongs([]);
    setStoredSequence([]);
    setAuthAttempt([]);
    setStatus(null);
    setSetupMode(true);
  };

  const randomizeSequence = (sequence) => {
    const shuffled = [...sequence];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  return (
    <div className="container">
      <h1>{setupMode ? "Set Up Your Song Sequence" : "Authenticate"}</h1>
      {status && <p className="status-message">{status}</p>}
      <div className="grid">
        {setupMode
          ? songs.map((song, index) => (
              <button
                key={index}
                className={`song-button ${
                  selectedSongs.includes(song) ? "selected" : ""
                }`}
                onClick={() => handleSongSelect(song)}
              >
                {song}
                {selectedSongs.includes(song) && (
                  <span className="order-number">
                    {selectedSongs.indexOf(song) + 1}
                  </span>
                )}
              </button>
            ))
          : storedSequence.map((song, index) => (
              <button
                key={index}
                className={`song-button ${
                  authAttempt.includes(song) ? "selected" : ""
                }`}
                onClick={() => handleSongSelect(song)}
              >
                {song}
              </button>
            ))}
      </div>
      {setupMode ? (
        <button className="action-button" onClick={handleSetupComplete}>
          Save Sequence
        </button>
      ) : (
        <button className="action-button" onClick={handleAuthenticate}>
          Authenticate
        </button>
      )}

      <button className="reset-button" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}
