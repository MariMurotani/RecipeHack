import React, { useState } from "react";
import { Box, Popper } from "@mui/material";
import DoubleCircularBarPlot, { FlavorPairDataType } from "./DoubleCircularBarPlot";

interface GraphTooltipProps {
    data: FlavorPairDataType[];
    show: boolean; // ツールチップの表示/非表示を制御するプロパティ
    mousePosition: { x: number; y: number }; // マウスの位置を受け取る
}

const GraphTooltip: React.FC<GraphTooltipProps> = ({ data, show, mousePosition }) => {
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
        <DoubleCircularBarPlot data={data} />
      </Box>
    </Popper>
  );
};

export default GraphTooltip;
