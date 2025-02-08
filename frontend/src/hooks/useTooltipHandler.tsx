import React, { useState } from "react";
import { AromaCompound, Entry, FoodRecipePageRankResult } from "../api/types";
import { FlavorCompoundDataType } from "../components/NivoPieChart"
import { fetchAromaCompoundWithEntry, fetchFoodRecipePageRank } from "../api/neo4j"; 

export type TooltipType = "Pie" | "Hint";

export const useTooltipHandler = () => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipType, setTooltipType] = useState<TooltipType>("Pie");
  const [flavorCompoundData, setFlavorCompoundData] = useState<FlavorCompoundDataType[]>([]);
  const [hintData, setHintData] = useState<FoodRecipePageRankResult[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentEntry, setCurrentEntry] = useState<Entry | null>(null);

  const handleMouseHover = async (event: any, entry: Entry, type: TooltipType) => {
    setTooltipType(type);
    if (type === "Pie") {
      const aromaCompounds: AromaCompound[] = await fetchAromaCompoundWithEntry(entry.id);
      const flavorData: FlavorCompoundDataType[] = aromaCompounds.map((aroma) => ({
        flavorName: aroma.name,
        ratio: aroma.average_ratio,
        color: aroma.color ?? "#000000",
      }));
      setFlavorCompoundData([...flavorData]);
    } else if (type === "Hint") {
      const foodRecipeResult:FoodRecipePageRankResult[] = await fetchFoodRecipePageRank(entry.id);
      console.log(foodRecipeResult);
      setHintData([...foodRecipeResult]);
    }
    //const scrollOffsetY = window.scrollY || document.documentElement.scrollTop;
    //const scrollOffsetX = window.scrollX || document.documentElement.scrollLeft;
    
    setMousePosition({
      x: event.clientX,
      y: event.clientY,
    });
    setCurrentEntry(entry);
    setAnchorEl(event.currentTarget);
    setShowTooltip(true);
  };

  const handleMouseOut = (event?: any) => {
    console.log(event);
    setShowTooltip(false);
  };

  return {
    tooltipType,
    mousePosition,
    showTooltip,
    flavorCompoundData,
    hintData,
    anchorEl,
    currentEntry,
    handleMouseHover,
    handleMouseOut,
  };
};
