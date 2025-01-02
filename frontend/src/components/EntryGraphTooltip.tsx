import React, { useRef, useEffect } from "react";
import { Box, Popper } from "@mui/material";
import * as d3 from "d3";

export interface FlavorCompoundDataType {
  flavorName: string;
  ratio: number;
  color: string;
}

interface EntryGraphTooltipProps {
  data: FlavorCompoundDataType[];
  show: boolean; // ツールチップの表示/非表示を制御するプロパティ
  mousePosition: { x: number; y: number }; // マウスの位置を受け取る
}

const GraphTooltip: React.FC<EntryGraphTooltipProps> = ({ data, show, mousePosition }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Clear existing SVG content before redrawing
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    const pie = d3.pie<FlavorCompoundDataType>().value((d) => d.ratio);
    const arc = d3
      .arc<d3.PieArcDatum<FlavorCompoundDataType>>()
      .innerRadius(0) // Full pie chart
      .outerRadius(radius);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Draw the pie chart
    svg
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc as any)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", "1px");

    // Add labels
    svg
      .selectAll("text")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .text((d) => `${d.data.flavorName}`);
  }, [data]);

  return (
    <Popper
      open={show}
      anchorEl={null} // To dynamically position by mouse
      style={{
        position: "absolute",
        left: mousePosition.x + 10, // Offset from mouse position
        top: mousePosition.y + 10,
        pointerEvents: "none", // Prevent interference with mouse events
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: 1,
          minWidth: "250px", // Adjust the minimum width for the graph
        }}
      >
        <svg ref={svgRef}></svg>
      </Box>
    </Popper>
  );
};

export default GraphTooltip;
