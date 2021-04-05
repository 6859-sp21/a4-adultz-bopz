import * as d3 from "d3";

// svg colors + dims
export const width = 500;
export const height = 500;
export const pack = (data) =>
  d3.pack().size([width, height]).padding(3)(
    d3
      .hierarchy(data)
      .sum((d) => d.count)
      .sort((a, b) => b.count - a.count)
  );
