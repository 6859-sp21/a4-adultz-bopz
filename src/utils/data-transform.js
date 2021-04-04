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
        return { name: word[0], children: word[1] };
      });
      return { name: item[0], children: groupedByBadword };
    }
  );

  return groupedByArtist;
};

export const genArtists = async () => {
  const csvData = await genRawData();
  const artistSet = new Set();
  csvData.map((data) => {
    artistSet.add(data.ogArtist);
  });
  const artistList = Array.from(artistSet)
    .sort()
    .map((artist) => {
      return { label: artist, value: artist };
    });
  return artistList;
};
