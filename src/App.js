import { useState, useEffect } from "react";
import Select from "react-select";
import "./App.css";
import Bubbles from "./Bubbles";
import { genArtists, genSongs } from "./utils/data-transform";

export const VIEW_ALL_OPTION = {
  label: "your favorite artist",
  value: "all",
  type: "all",
};

const App = () => {
  const [songOrArtist, setSongOrArtist] = useState(null);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [artistRes, songRes] = await Promise.all([
        genArtists(),
        // genSongs(),
      ]);
      setArtists(artistRes);
      // setSongs(songRes);
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      {/* <h1 className="App-header">What's your favorite artist spitting?</h1> */}
      <div className="App-header">
        What's
        <Select
          width="auto"
          autoFocus
          placeholder="your favorite artist"
          options={[VIEW_ALL_OPTION, ...artists]}
          value={songOrArtist}
          onChange={setSongOrArtist}
        />
        spitting?
      </div>
      <Bubbles songOrArtist={songOrArtist} setSongOrArtist={setSongOrArtist} />
    </div>
  );
};

export default App;
