import React from "react";
import { Box } from "@mui/material";
import { useHeatmap } from "../hooks/useHeatMap";

interface HeatmapData {
    group: string;
    variable: string;
    value: number;
}

interface HeatmapProps {
    data: HeatmapData[];
    width?: number;
    height?: number;
}

const Heatmap: React.FC<HeatmapProps> = ({ data, width = 450, height = 450 }) => {
  const svgRef = useHeatmap(data, 450, 450);

  return (
    <Box>
        <svg ref={svgRef} width={500} height={500}></svg>
    </Box>
  );
};

export default Heatmap;
