window.addEventListener("DOMContentLoaded", async () => {
  const csvData = await genRawData();

  let artistList = extractArtistsNameJSON(csvData);
  convertToDropdown(artistList);
  addDropdownEventListener();
});


const extractArtistsNameJSON = (data) => {
  return Array.from(d3.group(data, d => d.ogArtist)).map((item) => item[0]).sort();
}

const convertToDropdown = (artistList) => {
  let dropdownRef = document.getElementById("artist-dropdown");
  artistList.map((artist, idx) => {
    let optionElem = document.createElement("option");
    optionElem.setAttribute("id", "artist-" + idx);
    optionElem.setAttribute("value", artist);
    optionElem.textContent = artist;
    dropdownRef.appendChild(optionElem);
  });
}

const addDropdownEventListener = () => {
  document.getElementById("artist-dropdown").addEventListener("change", (e) => {
    console.log("Selected", e.target.value);
  })
}
