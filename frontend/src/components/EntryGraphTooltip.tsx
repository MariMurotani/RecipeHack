import React from "react";
import { Box, IconButton, Popper, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NivoPieChart, { FlavorCompoundDataType } from "../components/NivoPieChart";
import { SxProps, Theme } from "@mui/material/styles";

interface EntryGraphTooltipProps {
  data: FlavorCompoundDataType[];
  mousePosition: { x: number; y: number };
  anchorEl: null | HTMLElement;
  title: string;
  show: boolean;
  onClose: () => void;
  sx?: SxProps<Theme>;
}

const GraphTooltip: React.FC<EntryGraphTooltipProps> = ({ data, mousePosition, anchorEl, title, show, onClose, sx }) => {
  const width = 200;
  const height = 200;

  return (
    (show) &&
    <Popper
      open={true} // anchorEl が存在するときにのみ表示
      anchorEl={anchorEl}
      placement="top"
      modifiers={[
        {
          name: "preventOverflow",
          options: {
            boundary: "window", // Prevents going outside the viewport
            padding: 10,
          },
        },
        {
          name: "flip",
          options: {
            fallbackPlacements: ["bottom", "left", "right"], // Auto-adjusts placement
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
          <IconButton
            sx={{ position: "absolute", top: 5, right: 5 }}
            onClick={onClose} // Close Tooltip
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        <Typography>{title}</Typography>
        <NivoPieChart data={data}></NivoPieChart>
      </Box>
    </Popper>
  );
};

export default GraphTooltip;
