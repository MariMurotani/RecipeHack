import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface HeatmapData {
  group: string;
  variable: string;
  value: number;
}

export const useHeatmap = (data: HeatmapData[], width: number, height: number) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 80, right: 25, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Extract unique groups and variables
    const groups = Array.from(new Set(data.map((d) => d.group)));
    const variables = Array.from(new Set(data.map((d) => d.variable)));

    // Scales
    const x = d3.scaleBand().domain(groups).range([0, innerWidth]).padding(0.05);
    const y = d3.scaleBand().domain(variables).range([innerHeight, 0]).padding(0.05);
    const color = d3
      .scaleSequential(d3.interpolateInferno)
      .domain([1, d3.max(data, (d) => d.value) || 100]);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSize(0))
      .select(".domain")
      .remove();

    g.append("g").call(d3.axisLeft(y).tickSize(0)).select(".domain").remove();

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid 1px grey")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("opacity", 0);

    // Interaction Handlers
    const mouseover = function (event: MouseEvent, d: HeatmapData) {
      tooltip.style("opacity", 1);
      d3.select(event.currentTarget as SVGGElement)
        .style("stroke", "black")
        .style("opacity", 1);
    };
    
    const mousemove = function (event: MouseEvent, d: HeatmapData) {
      tooltip
        .html(`Value: ${d.value}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY}px`);
    };
    
    const mouseleave = function (event: MouseEvent) {
      tooltip.style("opacity", 0);
      d3.select(event.currentTarget as SVGGElement)
        .style("stroke", "none")
        .style("opacity", 0.8);
    };

    // Rectangles
    g.selectAll()
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.group)!)
      .attr("y", (d) => y(d.variable)!)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", 4)
      .attr("ry", 4)
      .style("fill", (d) => color(d.value)!)
      .style("opacity", 0.8)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  }, [data, width, height]);

  return svgRef;
};
