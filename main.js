window.addEventListener("DOMContentLoaded", async () => {
  console.log('Done loading DOM...')

  const data = await d3.csv("https://raw.githubusercontent.com/the-pudding/data/master/kidz-bop/KB_censored-lyrics.csv");
  loadWordCloud(data);

});


loadWordCloud = (data) => {
  const height = 560;
  const width = 760;
  const margin = ({
      top: 10,
      right: 10,
      bottom: 20,
      left: 20
  });

  //1. Create SVG element 
  const svg = d3.create('svg').style("width", width).style("height", height).style('background', 'white')

  svg.style('margin', '12px auto')

  let groupedData = Array.from(d3.group(data, d => d.ogArtist)).sort((a, b) => b[1].length - a[1].length)

  svg.selectAll('text')
     .data(groupedData)
     .join('text')
      .text(d => d[0])
      .style('font-size', (d) => 5 + d[1].length)
      .attr('x', Math.random() * width)
      .attr('y', Math.random() * height)

  svg
    .selectAll("text")
    .on("click", (e) => {
      console.log(e.target.value)
    })


  // document.getElementById("wordcloud").appendChild(svg.node())
}