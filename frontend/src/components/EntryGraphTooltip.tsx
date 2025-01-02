import React from "react";
import { Box, Popper, Typography } from "@mui/material";
import { useD3PieChart, FlavorCompoundDataType} from "../hooks/useD3PieChart";

interface EntryGraphTooltipProps {
  data: FlavorCompoundDataType[];
  mousePosition: { x: number; y: number };
  anchorEl: null | HTMLElement;
  title: string;
}

const GraphTooltip: React.FC<EntryGraphTooltipProps> = ({ data, mousePosition, anchorEl, title }) => {
  const width = 200;
  const height = 200;

  // Use the custom hook
  const svgRef = useD3PieChart(data, width, height);

  return (
    <Popper
      open={true} // anchorEl が存在するときにのみ表示
      anchorEl={anchorEl}
      placement="top"
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 10],
          },
        },
      ]}
      style={{
        display: "flex",
        justifyContent: "center", // 水平方向の中央揃え
        alignItems: "center", // 垂直方向の中央揃え
        position: "absolute",
        left: mousePosition.x + 30, // Offset from mouse position
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
          minWidth: "250px",
          textAlign: "center",
        }}
      >
        <Typography>{title}</Typography>
        <svg ref={svgRef}></svg>
      </Box>
    </Popper>
  );
};

export default GraphTooltip;
