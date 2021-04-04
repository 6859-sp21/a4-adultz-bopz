import { useState, useEffect } from "react";
import Select from "react-select";
import "./App.css";
import Bubbles from "./Bubbles";
import { genArtists, genSongs } from "./utils/data-transform";

const App = () => {
  const [songOrArtist, setSongOrArtist] = useState(null);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [artistRes, songRes] = await Promise.all([
        genArtists(),
        genSongs(),
      ]);
      setArtists(artistRes);
      setSongs(songRes);
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <h1 className="App-header">What's your favorite artist spitting?</h1>
      <div className="App-select">
        <Select
          placeholder="Search for an artist or song..."
          options={[...artists, ...songs]}
          value={songOrArtist}
          onChange={(option) => setSongOrArtist(option)}
        />
      </div>
      <Bubbles songOrArtist={songOrArtist} />
    </div>
  );
};

export default App;
