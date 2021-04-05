import * as d3 from "d3";

// svg colors + dims
export const width = 500;
export const height = 500;
export const scale1 = d3
  .scaleSequential(d3.interpolate("#00875A", "#ABF5D1"))
  .domain([0, 30]);
export const scale2 = d3
  .scaleSequential(d3.interpolate("#00B8D9", "#B3F5FF"))
  .domain([2, 8]);
export const scale3 = d3
  .scaleSequential(d3.interpolate("#C054BE", "#E1C7E0"))
  .domain([0, 8]);
export const color = [null, scale1, scale2, scale3];

export const pack = (data) =>
  d3.pack().size([width, height]).padding(3)(
    d3
      .hierarchy(data)
      .sum((d) => d.count)
      .sort((a, b) => b.count - a.count)
  );
