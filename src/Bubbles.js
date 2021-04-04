import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import { genNestedData } from "./utils/data-transform";

const width = 500;
const height = 500;
const color = ["red", "blue", "yellow", "pink"];
//d3.scaleSequential(d3.interpolatePlasma).domain([0, 3]);

const pack = (data) =>
  d3.pack().size([width, height]).padding(3)(
    d3
      .hierarchy(data)
      .sum((d) => d.count)
      .sort((a, b) => b.count - a.count)
  );

const Bubbles = () => {
  const [data, setData] = useState(null);

  const d3Container = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await genNestedData();
      setData(res);
    };
    fetchData();
  }, []);

  /* The useEffect Hook is for running side effects outside of React,
       for instance inserting elements into the DOM using D3 */
  useEffect(() => {
    if (data && d3Container.current) {
      const input = { name: "artists", children: data };
      const root = pack(input);
      let focus = root;
      let view;

      const svg = d3
        .select(d3Container.current)
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .style("display", "block")
        .style("margin", "0 -14px")
        .attr("text-anchor", "middle")
        .style("cursor", "pointer")
        .on("click", (event) => zoom(event, root));

      const node = svg
        .append("g")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .join("circle")
        .attr("stroke", (d) => color[d.depth])
        .attr("fill", "transparent")
        .style("display", (d) => (d.parent === root ? "inline" : "none"))
        .on("mouseover", (e, d) => {
          d3.select(e.target).attr("fill", color[d.depth]);
          d3.select("text");
        })
        .on("mouseout", (e) => {
          d3.select(e.target).attr("fill", "transparent");
        })
        .on("click", (event, d) => {
          if (focus !== d) {
            zoom(event, d);
            event.stopPropagation();
          }
        });

      const shouldShowLabel = (d) => {
        return (d.parent === root && d.r > 20) || d.depth > 1;
      };

      const label = svg
        .append("g")
        .style("font", "5px Lato")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .style("fill", "white")
        .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
        .style("display", (d) => (shouldShowLabel(d) ? "inline" : "none"))
        .text((d) => (!d.children ? d.data.songName : d.data.name));

      const zoomTo = (v, t) => {
        const k = width / v[2];
        view = v;
        label.attr("transform", (d) => {
          return `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`;
        });
        node.attr(
          "transform",
          (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
        );
        node.attr("r", (d) => d.r * k);
      };

      zoomTo([root.x, root.y, root.r * 2], 1);

      const zoom = (event, d) => {
        focus = d;
        console.log(focus);

        const transition = svg
          .transition()
          .duration(event.altKey ? 7500 : 750)
          .tween("zoom", (d) => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return (t) => zoomTo(i(t), t);
          });

        node
          .filter(function (d) {
            return d.parent === focus || this.style.display === "inline";
          })
          .transition(transition)
          .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
          .on("start", function (d) {
            if (d.parent === focus) this.style.display = "inline";
          })
          .on("end", function (d) {
            if (d.parent !== focus) this.style.display = "none";
          });

        label
          .filter(function (d) {
            return d.parent === focus || this.style.display === "inline";
          })
          .transition(transition)
          .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
          .on("start", function (d) {
            if (shouldShowLabel(d)) this.style.display = "inline";
          })
          .on("end", function (d) {
            if (d.parent !== focus) this.style.display = "none";
          });
      };

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          zoom(e, root);
        }
      });
    }
  }, [data]);

  return (
    <svg
      className="d3-component"
      width="100%"
      height="100%"
      ref={d3Container}
    />
  );
};

export default Bubbles;
