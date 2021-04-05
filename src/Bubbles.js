import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import { genNestedData } from "./utils/data-transform";
import { width, height, pack } from "./utils/d3-config.js";
import { VIEW_ALL_OPTION } from "./App";

const scale1 = d3
  .scaleSequential(d3.interpolate("#00875A", "#ABF5D1"))
  .domain([0, 30]);
const scale2 = d3
  .scaleSequential(d3.interpolate("#00B8D9", "#B3F5FF"))
  .domain([2, 8]);
const scale3 = d3
  .scaleSequential(d3.interpolate("#C054BE", "#E1C7E0"))
  .domain([0, 8]);

// TODO: Create scale 4
const color = [null, scale1, scale2, scale3, scale3];

let svg, view, label, node, focus;

const Bubbles = ({ songOrArtist, setSongOrArtist }) => {
  const [root, setRoot] = useState(null);

  const d3Container = useRef(null);

  const updateArtistTitle = (artistName) => {
    let textValue = artistName !== "artists" ? artistName : "";

    // Only update select if clicking to a new artist
    setSongOrArtist(
      artistName !== ""
        ? { value: artistName, label: artistName, type: "artist" }
        : VIEW_ALL_OPTION
    );
    d3.select("#selectedArtistName")
      .style("text-align", "center")
      .style("color", "white")
      .text(textValue);
  };

  const shouldShowLabel = (d) => {
    return (d.parent === root && d.r > d.data.name.length * 2) || d.depth > 1;
  };

  const zoomTo = (v) => {
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

  const zoom = (event, d) => {
    focus = d;

    const transition = svg
      .transition()
      .duration(event.altKey ? 7500 : 750)
      .tween("zoom", (d) => {
        const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
        return (t) => zoomTo(i(t));
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

  useEffect(() => {
    const fetchData = async () => {
      const res = await genNestedData();
      const input = { name: "artists", children: res };
      setRoot(pack(input));
    };
    fetchData();
  }, []);

  /* The useEffect Hook is for running side effects outside of React,
       for instance inserting elements into the DOM using D3 */
  useEffect(() => {
    d3.selectAll("g > *").remove();

    if (root && d3Container.current) {
      focus = root;

      // viz container
      svg = d3
        .select(d3Container.current)
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .style("display", "block")
        .style("height", "80vh")
        .style("margin", "0 -14px")
        .attr("text-anchor", "middle")
        .style("cursor", "pointer")
        .on("click", (event) => {
          zoom(event, root);
          updateArtistTitle("");
        });

      // glow
      const defs = svg.append("defs");
      const filter = defs.append("filter").attr("id", "glow");
      filter
        .append("feGaussianBlur")
        .attr("stdDeviation", "2")
        .attr("result", "coloredBlur");
      const feMerge = filter.append("feMerge");
      feMerge.append("feMergeNode").attr("in", "coloredBlur");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");

      // circle nodes
      node = svg
        .append("g")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .join("circle")
        .attr("stroke", (d) => {
          if( typeof color[d.depth] === 'function'){
            return color[d.depth](d.r);
          }
        })
        .attr("fill", "transparent")
        .style("display", (d) => (d.parent === root ? "inline" : "none"))
        .on("mouseover", (e, d) => {
          d3.select(e.target)
            .attr("stroke-width", 4)
            .style("filter", "url(#glow)");
          if (!shouldShowLabel(d)) {
            d3.select("#tooltip")
              .transition()
              .duration(200)
              .style("opacity", 1)
              .text(d.data.name);
          }
        })
        .on("mousemove", (e) => {
          d3.select("#tooltip")
            .style("left", e.pageX + 10 + "px")
            .style("top", e.pageY - 10 + "px");
        })
        .on("mouseout", (e) => {
          d3.select(e.target).attr("stroke-width", 1).style("filter", null);
          d3.select("#tooltip").transition().duration(200).style("opacity", 0);
        })
        .on("click", (event, d) => {
          if (focus !== d) {
            if (d.depth === 1) {
              updateArtistTitle(d.data.name);
            }
            zoom(event, d);
            event.stopPropagation();
          }
        });

      // labels
      label = svg
        .append("g")
        .style("font", "8px Lato")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .style("fill", "white")
        .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
        .style("display", (d) => (shouldShowLabel(d) ? "inline" : "none"))
        .text((d) => (!d.children ? d.data.songName : d.data.name));

      // tooltip
      d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .attr("style", "position: absolute; opacity: 0;")
        .style("color", "white")
        .style("font", "12px Lato")
        .style("background-color", "#102a43bb")
        .style("padding", "8px")
        .style("border-radius", "4px");

      // esc key zooms out
      zoomTo([root.x, root.y, root.r * 2]);
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [root]);

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      zoom(e, root);
      updateArtistTitle("");
    }
  };

  useEffect(() => {
    if (songOrArtist && root) {
      const newFocus = root
        .descendants()
        .filter((d) => d.data.name === songOrArtist.value)[0];
      if (newFocus) {
        zoom({}, newFocus);
      }
    }
  }, [songOrArtist, root, zoom]);

  return (
    <>
      <h3 id="selectedArtistName"></h3>
      <svg
        className="d3-component"
        width="100%"
        height="100%"
        ref={d3Container}
      />
    </>
  );
};

export default Bubbles;
