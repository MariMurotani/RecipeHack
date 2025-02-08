import React from "react";
import { Popper, Box, Typography, SxProps, Theme, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { FoodRecipePageRankResult } from "../api/types";

interface HintTooltipProps {
  recipeRankResults: FoodRecipePageRankResult[];
  mousePosition: { x: number; y: number };
  anchorEl: null | HTMLElement;
  title: string;
  show: boolean;
  onClose: () => void;
  onClick: () => void;
  sx?: SxProps<Theme>;
}

const FoodTooltip: React.FC<HintTooltipProps> = ({ recipeRankResults, anchorEl, show, mousePosition, onClose, sx }) => {
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
          textAlign: "left",
        }}
      >
          <IconButton
            sx={{ position: "absolute", top: 5, right: 5 }}
            onClick={onClose} // Close Tooltip
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        <ul>
            {recipeRankResults.map((recipeRankResult) => (
            <li key={recipeRankResult.foodName}>
                {recipeRankResult.foodName} ({recipeRankResult.displayNameJa})
            </li>
            ))}
        </ul>
      </Box>
    </Popper>
  );
};

export default FoodTooltip;
