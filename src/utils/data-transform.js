import * as d3 from "d3";

export const genRawData = async () => {
  return await d3.csv(
    "https://raw.githubusercontent.com/the-pudding/data/master/kidz-bop/KB_censored-lyrics.csv"
  );
};

export const genNestedData = async () => {
  const csvData = await genRawData();
  let groupedByArtist = Array.from(d3.group(csvData, (d) => d.ogArtist)).map(
    (item) => {
      let groupedByBadword = Array.from(
        d3.group(item[1], (d) => d.badword)
      ).map((word) => {
        let groupedBySong = Array.from(
          d3.group(word[1], (d) => d.songName)
        ).map((song) => { 
          // Remove repeated lyrics
          let groupedByLyric = Array.from(
            d3.group(song[1], (d) => d.ogLyric)
          ).map((uniqueLyricGroup) => {
            // uniqueLyricGroup = is a size-2 array with lyric and index 0 and array of data points at index 1
            let dataEntries = uniqueLyricGroup[1];
            let firstUniqueEntry = dataEntries[0];
            const { ogLyric, kbLyric, badword } = firstUniqueEntry;
            
            let { kbLyricHTML, ogLyricHTML } = compareLyrics(badword, ogLyric, kbLyric);
            return { ...firstUniqueEntry, kbLyricHTML: kbLyricHTML, ogLyricHTML: ogLyricHTML}
          })
          return { name: song[0], children: groupedByLyric };
        });
        return { name: word[0], children: groupedBySong };
      });
      return { name: item[0], children: groupedByBadword };
    }
  );

  return groupedByArtist;
};

export const genArtists = async () => {
  const csvData = await genRawData();
  const artistList = Array.from(d3.group(csvData, d => d.ogArtist))
    .map((artist) => { 
      return { label: artist[0], value: artist[0], type: "artist" }
    })
    .sort((a, b) => a.label.localeCompare(b.label));
  return artistList;
};

export const genSongs = async () => {
  const csvData = await genRawData();
  const songList = Array.from(d3.group(csvData, d => d.songName))
    .map((song) => { 
      return { label: song[0], value: song[0], type: "song" }
    })
    .sort((a, b) => a.label.localeCompare(b.label));
  return songList;
};


const compareLyrics = (badword, ogLyric, kbLyric) => {

  let ogLyricParsed = ogLyric.split(" ");
  let ogLyricObj = convertArrayToJSON(ogLyricParsed);
  let ogLyricHTML = getFormattedOGLyricAsHTML(ogLyricParsed, badword);

  let kbLyricParsed = kbLyric.split(" ");
  let kbLyricHTML = ( kbLyric === "cuts verse" ) ? "<i>cuts verse</i>" : getFormattedKBLyricAsHTML(ogLyricObj, kbLyricParsed);

  return { 'kbLyricHTML': "<span>" + kbLyricHTML + "</span>", 'ogLyricHTML' : "<span>" + ogLyricHTML + "</span>" };
}


const convertArrayToJSON = (arr) => Object.assign(...arr.map((k) => ({[k]: 0})));

const getFormattedOGLyricAsHTML = (ogLyricWordArray, badword) => {
  return ogLyricWordArray.map((ogWord) => {
    return "<span class='ogLyric-" + (ogWord.toLowerCase().includes(badword) ? 'bad' : 'good') + "'>" + ogWord + "</span>";
  }).join(" ");
}

const getFormattedKBLyricAsHTML = (ogLyricWordObj, kbLyricWordArray) => {
  let prev = true; // true if same, false if altered
  return kbLyricWordArray.map((kbWord, i) => {
    
    // Check if KB Word exists in OG Lyric
    let kbWordInOGLyric = ogLyricWordObj[kbWord] !== undefined;

    if( kbWordInOGLyric ){
      // Word is in both OG and KB Lyric
      // if prev word was a altered lyric, close the span
      let prefix = !prev 
        ? "</span><span class='kblyric-same start'>" 
        : "<span class='kblyric-same'>"
      prev = true
      return prefix + kbWord + "</span> ";
      
    } else {
      // kbWord is not in og lyric
      // CHANGE
      // if it is the last word in the word array, close the span if the previous word is a altered word
      let suffix = !prev && kbLyricWordArray.length - 1 == i ? "</span>" : ""
      // if the previous word is a different word, don't start the span
      let prefix = prev ? "<span class='kblyric-different'>" : ""
      prev = false
      return prefix + kbWord + suffix;
    }
  }).join(" ");

}