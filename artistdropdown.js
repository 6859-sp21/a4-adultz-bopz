window.addEventListener("DOMContentLoaded", async () => {
  console.log('Done loading DOM...')

  const csvData = await d3.csv("https://raw.githubusercontent.com/the-pudding/data/master/kidz-bop/KB_censored-lyrics.csv");

  let artistList = extractArtistsNameJSON(csvData);
  convertToDropdown(artistList);
  addDropdownEventListener();
});


const extractArtistsNameJSON = (dataset) => {
  let uniqueArtists = new Set();
  dataset.map((item) => uniqueArtists.add(item.ogArtist));
  let artistList = [];
  uniqueArtists.forEach((artist) => {
    artistList.push({
      text: artist,
      value: artist
    });
  });

  const artistComparator = (a, b) => {
    a = a.text.toLowerCase();
    b = b.text.toLowerCase();
    return (a < b) ? -1 : (a > b) ? 1 : 0;
  }

  return artistList.sort(artistComparator);
}

const convertToDropdown = (artistList) => {
  let dropdownRef = document.getElementById("artist-dropdown");
  artistList.map((artist, idx) => {
    let optionElem = document.createElement("option");
    optionElem.setAttribute("id", "artist-" + idx);
    optionElem.setAttribute("value", artist.value);
    optionElem.textContent = artist.text;
    dropdownRef.appendChild(optionElem);
  });
}

const addDropdownEventListener = () => {
  document.getElementById("artist-dropdown").addEventListener("change", (e) => {
    console.log("Selected", e.target.value);
  })
}
