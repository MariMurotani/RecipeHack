import React from "react";
import { Box, Popper, Typography } from "@mui/material";
import { useD3PieChart, FlavorCompoundDataType} from "../hooks/useD3PieChart";
import { SxProps, Theme } from "@mui/material/styles";

interface EntryGraphTooltipProps {
  data: FlavorCompoundDataType[];
  mousePosition: { x: number; y: number };
  anchorEl: null | HTMLElement;
  title: string;
  show: boolean;
  sx?: SxProps<Theme>; // sxプロパティを追加
}

const GraphTooltip: React.FC<EntryGraphTooltipProps> = ({ data, mousePosition, anchorEl, title, show, sx }) => {
  const width = 200;
  const height = 200;

  // Use the custom hook
  const svgRef = useD3PieChart(data, width, height);

  return (
    (show) &&
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
      sx={{
        ...sx
      }}
      style={{ position: "fixed", top: mousePosition.y, left: mousePosition.x }}
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
