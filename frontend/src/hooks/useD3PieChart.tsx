import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

export interface FlavorCompoundDataType {
  flavorName: string;
  ratio: number;
  color: string;
}

export const useD3PieChart = (
  data: FlavorCompoundDataType[],
  width: number,
  height: number
) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const radius = Math.min(width, height) / 2;

    const drawChart = () => {
      if (!svgRef.current) {
        console.log("SVG element not yet mounted, retrying...");
        return false; // Return false to indicate retry needed
      }

      // Clear existing SVG content before redrawing
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const pie = d3.pie<FlavorCompoundDataType>().value((d) => d.ratio);
      const arc = d3
        .arc<d3.PieArcDatum<FlavorCompoundDataType>>()
        .innerRadius(0) // Full pie chart
        .outerRadius(radius);

      const chart = svg
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      // Draw the pie chart
      chart
        .selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc as any)
        .attr("fill", (d) => d.data.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", "1px");

      // Add labels
      chart
        .selectAll("text")
        .data(pie(data))
        .enter()
        .append("text")
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text((d) => `${d.data.flavorName}`);

      setIsReady(true); // Mark as ready
      return true; // Chart successfully drawn
    };

    let retries = 0;
    const maxRetries = 10;

    const interval = setInterval(() => {
      if (drawChart()) {
        clearInterval(interval); // Clear the interval if successful
      } else if (retries >= maxRetries) {
        console.error("Failed to mount SVG after multiple retries");
        clearInterval(interval);
      }
      retries++;
    }, 100); // Retry every 100ms

    return () => clearInterval(interval); // Cleanup on unmount
  }, [data, width, height]);

  return svgRef;
};
