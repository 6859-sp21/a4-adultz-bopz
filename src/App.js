import { useState, useEffect } from "react";
import Select from "react-select";
import "./App.css";
import Bubbles from "./Bubbles";
import { genArtists } from "./utils/data-transform";

const App = () => {
  const [artistName, setArtistName] = useState("");
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await genArtists();
      setArtists(res);
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <h1 className="App-header">What's your favorite artist spitting?</h1>
      <div className="App-select">
        <Select
          placeholder="Search for an artist..."
          options={artists}
          value={artistName}
          onChange={(option) => setArtistName(option)}
        />
      </div>
      <Bubbles artistName={artistName.value} />
    </div>
  );
};

export default App;
