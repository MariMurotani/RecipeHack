import React, { useRef, useEffect } from "react";
import { Box, Popper, Typography } from "@mui/material";
import * as d3 from "d3";

export interface FlavorCompoundDataType {
  flavorName: string;
  ratio: number;
  color: string;
}

interface EntryGraphTooltipProps {
  data: FlavorCompoundDataType[];
  mousePosition: { x: number; y: number }; // マウスの位置を受け取る,
  anchorEl: null | HTMLElement;
  title: string;
}

const GraphTooltip: React.FC<EntryGraphTooltipProps> = ({ data, mousePosition, anchorEl , title}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const width = 200;
  const height = 200;
  const radius = Math.min(width, height) / 2;

  useEffect(() => {
  
    console.log(svgRef.current);

    const pie = d3.pie<FlavorCompoundDataType>().value((d) => d.ratio);
    const arc = d3
      .arc<d3.PieArcDatum<FlavorCompoundDataType>>()
      .innerRadius(0) // Full pie chart
      .outerRadius(radius);
  
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .selectAll("g") // Ensure existing `g` elements are reused
      .data([null]) // Bind data to a single parent group
      .join("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
    // Draw the pie chart
    const paths = svg.selectAll("path").data(pie(data));
    paths
      .join("path") // Enter, update, and exit paths
      .attr("d", arc as any)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", "1px");
  
    // Add labels
    const labels = svg.selectAll("text").data(pie(data));
    labels
      .join("text") // Enter, update, and exit labels
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .text((d) => `${d.data.flavorName}`);
  }, [data]);

  return (
    <Popper
      open={true}
      anchorEl={anchorEl} // To dynamically position by mouse
      placement="top" // Optional: 他の位置指定も可能
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 0], // 必要ならオフセットを調整
          },
        },
      ]}
      style={{
        display: "flex",
        justifyContent: "center", // 水平方向の中央揃え
        alignItems: "center", // 垂直方向の中央揃え
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
      <Typography> {title} </Typography>
      <svg ref={svgRef}></svg>
      </Box>
    </Popper>
  );
};

export default GraphTooltip;
