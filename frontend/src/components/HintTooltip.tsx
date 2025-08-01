import React from "react";
import { Popper, Box, Typography, SxProps, Theme, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { Entry, FoodRecipePageRankResult } from "../api/types";

interface HintTooltipProps {
  recipeRankResults: FoodRecipePageRankResult[];
  mousePosition: { x: number; y: number };
  anchorEl: null | HTMLElement;
  title: string;
  show: boolean;
  onClose: () => void;
  onClick: (entry: Entry) => void;
  sx?: SxProps<Theme>;
}

const FoodTooltip: React.FC<HintTooltipProps> = ({ recipeRankResults, anchorEl, show, mousePosition, onClose, onClick, sx }) => {
  if (!recipeRankResults) return null;

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
            boundary: "window",
            padding: 20,
            margin: 20
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
          minWidth: "250px"
        }}
      >
        {/* Close Button */}
        <IconButton
            sx={{ position: "absolute", top: 5, left: 2 }}
            onClick={onClose} // Close Tooltip
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        {/* List of Food Items */}
        <ul style={{ listStyle: "none", padding: 0 }}>
            {recipeRankResults.map((food) => (
                <li key={food.e1.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <IconButton size="small" onClick={() => onClick(food.e1)} disabled={!food.e1.name}>
                        <AddIcon fontSize="small" />
                    </IconButton>
                    <span style={{ fontSize: "14px" }}>
                        {food.e1.name ? `${food.e1.name} - (${food.e1.name_ja})` : food.e1.id}
                    </span>
                </div>
                </li>
            ))}
            </ul>
      </Box>
    </Popper>
  );
};

export default FoodTooltip;
