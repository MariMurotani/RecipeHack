import { useRef, useLayoutEffect } from "react";
import * as d3 from "d3";

export interface FlavorCompoundDataType {
  flavorName: string;
  ratio: number;
  color: string;
}

export const useD3PieChart = (data: FlavorCompoundDataType[], width: number, height: number) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useLayoutEffect(() => {
    if (!svgRef.current) return;

    const radius = Math.min(width, height) / 2;

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
  }, [data, width, height]);

  return svgRef;
};
