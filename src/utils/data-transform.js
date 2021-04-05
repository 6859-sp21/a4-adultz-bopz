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
          return { name: song[0], children: song[1] };
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
