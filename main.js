window.addEventListener("DOMContentLoaded", async () => {
  console.log('Done loading DOM...')

  const csvData = await d3.csv("https://raw.githubusercontent.com/the-pudding/data/master/kidz-bop/KB_censored-lyrics.csv");
});


loadWordCloud = () => {
  
  const height = 400;
  const width = 400;
  const margin = ({
      top: 10,
      right: 10,
      bottom: 20,
      left: 20
  });

}