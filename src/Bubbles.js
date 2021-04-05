import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import { genNestedData } from "./utils/data-transform";
import { width, height, pack } from "./utils/d3-config.js";
import { VIEW_ALL_OPTION } from "./App";
import "./Bubbles.css";

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

  // don't call setSongOrArtist if title update is due to props change
  const updateArtistTitle = (d, shouldUpdate) => {
    let textValue;

    if (d.depth == 0) {
      // artist level
      textValue = "";
      if (shouldUpdate) setSongOrArtist(VIEW_ALL_OPTION);
    } else if (d.depth == 1) {
      // bad word level
      if (shouldUpdate) {
        setSongOrArtist({
          value: d.data.name,
          label: d.data.name,
          type: "artist",
        });
      }
      textValue = `Censored words in Kidz Bop songs by ${d.data.name}:`;
    } else if (d.depth == 2) {
      // song level
      textValue = `Songs that ${d.parent.data.name} say(s) '${d.data.name}':`;
    }

    d3.select("#selectedArtistName")
      .transition()
      .duration(200)
      .style("opacity", textValue == "" ? 0 : 1);

    if (textValue) {
      d3.select("#selectedArtistName").text(textValue);
    }
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
          if (focus !== root) {
            if (d3.select("#lyrics").style("z-index") > 0) {
              // Hide lyrics when escape button pushed
              closeLyrics();
            } else {
              updateArtistTitle(focus.parent, true);
              zoom(event, focus.parent);
            }
          }
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
          if (typeof color[d.depth] === "function") {
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
            updateArtistTitle(d, true);

            // Only zoom until you get to song level. Then reveal bad words in each song.
            if (d.depth < 3) {
              zoom(event, d);
            } else if (d.depth === 3) {
              generateLyricPopup(d.data);
            }
            event.stopPropagation();
          }
        });

      // labels
      label = svg
        .append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .style("font", (d) => (d.depth === 1 ? "8px Lato" : "12px Lato"))
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
        .style("background-color", "#334e68bb")
        .style("padding", "8px")
        .style("border-radius", "4px");

      // description text
      d3.select("#selectedArtistName")
        .style("font-weight", "200")
        .style("text-align", "center")
        .style("margin-top", "0")
        .style("color", "var(--light-text)")
        .style("opacity", "0")
        .text("All Artists");

      // Lyric breakdown
      d3.select("body")
        .append("div")
        .attr("id", "lyrics")
        .style("z-index", "-10")
        .style("position", "absolute")
        .style("opacity", "0")
        .style("width", "40vw")
        .style("height", "60vh")
        .style("left", "30%")
        .style("top", "20%")
        .style("overflow", "scroll")
        .style("color", "var(--light-text)")
        .style("font", "16px Lato")
        .style("background-color", "var(--dark-secondary)")
        .style("padding", "24px")
        .style("border-radius", "12px");

      d3.select("#lyrics")
        .append("button")
        .style("position", "absolute")
        .style("right", "12px")
        .style("top", "12px")
        .text("x")
        .on("click", () => {
          // Close lyric pop-up
          d3.select("#lyrics")
            .transition()
            .duration(200)
            .style("z-index", -10)
            .style("opacity", 0);
        });

      d3.select("#lyrics")
        .append("h2")
        .style("margin-top", 0)
        .style("text-align", "center")
        .attr("id", "lyrics-title");

      d3.select("#lyrics")
        .append("p")
        .style("text-align", "center")
        .attr("id", "lyrics-year");

      d3.select("#lyrics").append("div").attr("id", "lyrics-content");

      // esc key zooms out
      zoomTo([root.x, root.y, root.r * 2]);
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [root]);

  const closeLyrics = () => {
    d3.select("#lyrics")
      .transition()
      .duration(200)
      .style("opacity", 0)
      .style("z-index", -10);
  };

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      if (d3.select("#lyrics").style("z-index") > 0) {
        // Hide lyrics when escape button pushed
        closeLyrics();
      } else if (focus !== root) {
        updateArtistTitle(focus.parent, true);
        zoom(e, focus.parent);
      }
    }
  };

  const generateLyricRow = (data) => {
    let ogHeader = `<b>${data.ogArtist}</b><br />`;
    let ogLyricHTML =
      '<div class="Bubbles-ogLyric">"' + data.ogLyric + '"</div>';

    let kbHeader = "<b style='float:right'>Kidz Bop</b><br />";
    let kbLyricHTML =
      data.kbLyric === "cuts verse"
        ? '<div class="Bubbles-kbLyric"><i>cuts verse</i></div>'
        : '<div class="Bubbles-kbLyric">"' + data.kbLyric + '"</div>';

    return (
      "<div style='width:45%'>" +
      ogHeader +
      ogLyricHTML +
      "</div>" +
      "<div class='Bubbles-arrow'>--></div>" +
      "<div style='width:45%'>" +
      kbHeader +
      kbLyricHTML +
      "</div>"
    );
  };

  // Function to transform data into HTML content
  const generateLyricPopup = (data) => {
    // Merge all lyrics together
    const innerHTML = data.children
      .map((child) => {
        return (
          '<div class="Bubbles-lyricRow">' + generateLyricRow(child) + "</div>"
        );
      })
      .join("");

    let { songName, ogArtist, year } = data.children[0];
    const songTitle = songName + " by " + ogArtist;
    const releasedYear = "Released in " + year + ".";

    // Fill in title of lyric popup
    d3.select("#lyrics-title")
      .style("font-weight", "bold")
      .style("margin-bottom", 0)
      .text(songTitle);

    // Fill in year of lyric popup
    d3.select("#lyrics-year")
      .style("margin-top", 0)
      .style("margin-bottom", "8px")
      .text(releasedYear);

    // Fill in content of lyric popup
    d3.select("#lyrics-content").html(innerHTML);

    // Reveal lyric popup
    d3.select("#lyrics")
      .transition()
      .duration(200)
      .style("z-index", 10)
      .style("opacity", 1);
  };

  useEffect(() => {
    if (songOrArtist && root) {
      const newFocus = root
        .descendants()
        .filter((d) => d.data.name === songOrArtist.value)[0];
      if (newFocus) {
        zoom({}, newFocus);
        updateArtistTitle(newFocus, false);
      }
    }
  }, [songOrArtist, root]);

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
