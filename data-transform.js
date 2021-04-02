window.addEventListener("DOMContentLoaded", async () => {
  const csvData = await d3.csv("https://raw.githubusercontent.com/the-pudding/data/master/kidz-bop/KB_censored-lyrics.csv");
});

const genRawData = async () => {
  return await d3.csv("https://raw.githubusercontent.com/the-pudding/data/master/kidz-bop/KB_censored-lyrics.csv");
}

const genNestedData = async () => {

  const csvData = await genRawData();
  let groupedByArtist = Array.from(d3.group(csvData, (d) => d.ogArtist)).map((item) => {
    let groupedByBadword = Array.from(d3.group(item[1], d => d.badword)).map((word) => {
      return ({name: word[0], children: word[1]});
    })
    return({name: item[0], children: groupedByBadword});
  });

  return groupedByArtist;
}