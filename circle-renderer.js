window.addEventListener("DOMContentLoaded", async () => {
  let nestedData = await genNestedData();  
  makeCircle({"name": "artists", "children": nestedData});
});

const width = 500;
const height = 500;
color = d3.scaleLinear()
    .domain([0, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl)

pack = (data) => d3.pack()
    .size([width, height])
    .padding(3)
  (d3.hierarchy(data)
    .sum(d => d.count)
    .sort((a, b) => b.count - a.count))

makeCircle = (data) => {
  const root = pack(data);
  let focus = root;
  let view;

  const svg = d3.create("svg")
    .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
    .style("display", "block")
    .style("margin", "0 -14px")
    .attr("text-anchor", "middle")
    .style("cursor", "pointer")
    .style("background", color(0))
    .on("click", (event) => zoom(event, root));

  const node = svg.append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
      .attr("fill", d => d.children ? color(d.depth) : "white")
      .attr("pointer-events", d => !d.children ? "none" : null)
      .on("mouseover", (e) => { 
        d3.select(e.target).attr("stroke", "#000") 
      })
      .on("mouseout", (e) => { 
        d3.select(e.target).attr("stroke", null); 
      })
      .on("click", (event, d) => {
        if( focus !== d ) { 
          zoom(event, d);
          event.stopPropagation();
        }
      });

  const label = svg.append("g")
    .style("font", "10px sans-serif")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .selectAll("text")
      .data(root.descendants())
      .join("text")
      .style("fill-opacity", d => d.parent === root ? 1 : 0)
      .style("display", d => d.parent === root ? "inline" : "none")
      .text(d => !d.children ? d.data.songName : d.data.name ); // d.data.name);

  const zoomTo = (v) => {
    const k = width / v[2];
    view = v;
    label.attr("transform", d => {
      return `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
    });
    node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr("r", d => d.r * k);
  }

  zoomTo([root.x, root.y, root.r * 2]);

  const zoom = (event, d) => {
    const focus0 = focus;
    focus = d;

    const transition = svg.transition()
      .duration(event.altKey ? 7500 : 750)
      .tween("zoom", d => {
        const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
        return t => zoomTo(i(t));
      });

    label
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
      .transition(transition)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  document.getElementById("circle-pack").appendChild(svg.node())
}