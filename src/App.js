import { useState, useEffect } from "react";
import Select from "react-select";
import "./App.css";
import Bubbles from "./Bubbles";
import { genArtists } from "./utils/data-transform";

export const VIEW_ALL_OPTION = {
  label: "your favorite artist",
  value: "all",
  type: "all",
};

const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "var(--dark)",
    color: "var(--light-text)",
    border: "none",
    borderRadius: "0",
    borderBottom: "2px solid var(--light-green)",
    boxShadow: "none",
    "&:hover": {
      borderBottom: "2px solid var(--blue)",
    },
  }),
  placeholder: (base) => ({
    ...base,
    backgroundColor: "var(--dark)",
    color: "var(--dark-text)",
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--light-text)",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "var(--light-green)",
    "&:hover": {
      color: "var(--blue)",
    },
  }),
  input: (base) => ({
    ...base,
    color: "var(--light-text)",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--dark)",
    color: "var(--light-text)",
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "16px",
    color: "var(--light-text)",
    backgroundColor: state.isSelected
      ? "var(--blue)"
      : state.isFocused
      ? "var(--dark-green)"
      : "var(--dark)",
  }),
};

const App = () => {
  const [songOrArtist, setSongOrArtist] = useState(null);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const artistRes = await genArtists();
      setArtists(artistRes);
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <div className="App-escape">press ESC to zoom out</div>
      {/* <h1 className="App-header">What's your favorite artist spitting?</h1> */}
      <div className="App-header">
        What's
        <Select
          className="App-select"
          autoFocus
          placeholder="your favorite artist"
          options={[...artists]}
          value={songOrArtist}
          onChange={setSongOrArtist}
          styles={customStyles}
        />
        spitting?
      </div>
      <Bubbles songOrArtist={songOrArtist} setSongOrArtist={setSongOrArtist} />
    </div>
  );
};

export default App;
