import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

const fetchSongs = async (query, token) => {
  if (!query || !token) return [];
  
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      console.error("Error fetching songs:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    return data.tracks.items.map((track) => `${track.name} - ${track.artists.map((a) => a.name).join(", ")}`);
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
};

const ItemType = "SONG";

// Draggable Song Item
const SongItem = ({ song, index, moveSong, removeSong }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveSong(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="draggable-item">
      {index + 1}. {song} 
      <button onClick={() => removeSong(song)}>X</button>
    </div>
  );
};

export default function SongAuth() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [storedSequence, setStoredSequence] = useState([]);
  const [shuffledSongs, setShuffledSongs] = useState([]);
  const [authAttempt, setAuthAttempt] = useState([]);
  const [setupMode, setSetupMode] = useState(true);
  const [status, setStatus] = useState(null);
  const [shuffledOnce, setShuffledOnce] = useState(false);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch Spotify Access Token
  useEffect(() => {
    const getAccessToken = async () => {
      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
      const credentials = btoa(`${clientId}:${clientSecret}`);

      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${credentials}`,
          },
          body: "grant_type=client_credentials",
        });

        if (!response.ok) {
          console.error("Failed to get access token:", response.status, response.statusText);
          return;
        }

        const data = await response.json();
        setToken(data.access_token);
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    getAccessToken();
  }, []);

  useEffect(() => {
    const savedSequence = JSON.parse(localStorage.getItem("songSequence"));
    if (savedSequence) {
      setStoredSequence(savedSequence);
      setSetupMode(false);
    }
  }, []);

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 1 && token) {
      const results = await fetchSongs(e.target.value, token);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const addToPlaylist = (song) => {
    if (!playlist.includes(song)) {
      setPlaylist([...playlist, song]);
    }
  };

  const removeFromPlaylist = (song) => {
    setPlaylist(playlist.filter((s) => s !== song));
  };

  const moveSong = (fromIndex, toIndex) => {
    const updatedPlaylist = [...playlist];
    const [movedSong] = updatedPlaylist.splice(fromIndex, 1);
    updatedPlaylist.splice(toIndex, 0, movedSong);
    setPlaylist(updatedPlaylist);
  };

  const handleSetupComplete = () => {
    if (playlist.length > 0) {
      localStorage.setItem("songSequence", JSON.stringify(playlist));
      setStoredSequence(playlist);
      setSetupMode(false);
      setShuffledOnce(false);
      setAuthAttempt([]);
      setStatus(null);
    }
  };

  const shuffleOnce = () => {
    if (!shuffledOnce && storedSequence.length > 0) {
      const shuffled = [...storedSequence].sort(() => Math.random() - 0.5);
      setShuffledSongs(shuffled);
      setShuffledOnce(true);
    }
  };

  const handleAuthenticate = () => {
    if (JSON.stringify(authAttempt) === JSON.stringify(storedSequence)) {
      setStatus("Authentication Successful!");
    } else {
      setStatus("Authentication Failed. Try Again.");
    }
    setIsAuthenticated(true);
    setAuthAttempt([]);
  };
  

  const handleReset = () => {
    localStorage.removeItem("songSequence");
    setPlaylist([]);
    setStoredSequence([]);
    setShuffledSongs([]);
    setAuthAttempt([]);
    setStatus(null);
    setSetupMode(true);
    setShuffledOnce(false);
    setIsAuthenticated(false);
  };

  const handleSongClick = (song) => {
    if (!setupMode && !isAuthenticated) {
      setAuthAttempt([...authAttempt, song]);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <h1>{setupMode ? "Set Up Your Song Sequence" : "Authenticate"}</h1>
        {status && <p className="status-message">{status}</p>}

        {setupMode ? (
          <>
            <input
              type="text"
              placeholder="Search for a song..."
              value={searchQuery}
              onChange={handleSearch}
            />

            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((song, index) => (
                  <div
                    key={index}
                    className="search-item"
                    onClick={() => addToPlaylist(song)}
                  >
                    {song} +
                  </div>
                ))}
              </div>
            )}

            <h2>Your Playlist</h2>
            <div className="playlist">
              {playlist.map((song, index) => (
                <SongItem
                  key={song}
                  song={song}
                  index={index}
                  moveSong={moveSong}
                  removeSong={removeFromPlaylist}
                />
              ))}
            </div>

            <button className="action-button" onClick={handleSetupComplete}>
              Save Sequence
            </button>
          </>
        ) : (
          <>
            <h3>Select Songs in the Correct Order</h3>

            {shuffleOnce()}

            <div className="grid">
              {shuffledSongs.map((song, index) => (
                <button
                  key={index}
                  className={`song-button ${authAttempt.includes(song) ? "selected" : ""} ${isAuthenticated ? "disabled-button" : ""}`} 
                  onClick={() => handleSongClick(song)}
                  disabled={isAuthenticated}
                >
                  {song}
                </button>
              ))}
            </div>
            <button
              className={`action-button ${isAuthenticated ? "disabled-button" : ""}`} 
              onClick={handleAuthenticate}
              disabled={isAuthenticated}
            >
              Authenticate
            </button>

          </>
        )}

        <button className="reset-button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </DndProvider>
  );
}
