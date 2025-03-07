import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

const fetchSongs = async (query) => {
  const allSongs = [
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
  return allSongs.filter((song) =>
    song.toLowerCase().includes(query.toLowerCase())
  );
};

const ItemType = "SONG";

// 🎵 Draggable Song Item
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
      <button onClick={() => removeSong(song)}>❌</button>
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

  useEffect(() => {
    const savedSequence = JSON.parse(localStorage.getItem("songSequence"));
    if (savedSequence) {
      setStoredSequence(savedSequence);
      setSetupMode(false);
    }
  }, []);

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 1) {
      const results = await fetchSongs(e.target.value);
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
    if (!shuffledOnce) {
      const shuffled = [...storedSequence].sort(() => Math.random() - 0.5);
      setShuffledSongs(shuffled);
      setShuffledOnce(true);
    }
  };

  const handleAuthenticate = () => {
    if (JSON.stringify(authAttempt) === JSON.stringify(storedSequence)) {
      setStatus("✅ Authentication Successful!");
    } else {
      setStatus("❌ Authentication Failed. Try Again.");
    }
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
  };

  const handleSongClick = (song) => {
    if (!setupMode) {
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
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search for a song..."
              value={searchQuery}
              onChange={handleSearch}
            />

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((song, index) => (
                  <div
                    key={index}
                    className="search-item"
                    onClick={() => addToPlaylist(song)}
                  >
                    {song} ➕
                  </div>
                ))}
              </div>
            )}

            {/* Playlist Setup with Drag-and-Drop */}
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
            <h2>Select Songs in the Correct Order</h2>

            {/* Shuffle Once Before First Auth Attempt */}
            {shuffleOnce()}

            <div className="grid">
              {shuffledSongs.map((song, index) => (
                <button
                  key={index}
                  className={`song-button ${
                    authAttempt.includes(song) ? "selected" : ""
                  }`}
                  onClick={() => handleSongClick(song)}
                >
                  {song}
                </button>
              ))}
            </div>

            <button className="action-button" onClick={handleAuthenticate}>
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
