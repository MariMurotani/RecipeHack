import React, { useState } from "react";
import { AromaCompound, Entry } from "../api/types"; // 必要に応じて型をインポート
import { FlavorCompoundDataType } from "../hooks/useD3PieChart"; // 必要に応じて型をインポート
import { fetchAromaCompoundWithEntry } from "../api/neo4j"; // Aromaデータ取得の関数をインポート

export const useTooltipHandler = () => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [flavorCompoundData, setFlavorCompoundData] = useState<FlavorCompoundDataType[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentEntry, setCurrentEntry] = useState<Entry | null>(null);

  const handleMouseHover = async (event: React.MouseEvent<HTMLElement>, entry: Entry) => {
    const aromaCompounds: AromaCompound[] = await fetchAromaCompoundWithEntry(entry.id);
    const flavorData: FlavorCompoundDataType[] = aromaCompounds.map((aroma) => ({
      flavorName: aroma.name,
      ratio: aroma.average_ratio,
      color: aroma.color ?? "#000000",
    }));
    //const scrollOffsetY = window.scrollY || document.documentElement.scrollTop;
    //const scrollOffsetX = window.scrollX || document.documentElement.scrollLeft;
    
    setMousePosition({
      x: event.clientX,
      y: event.clientY,
    });
    setCurrentEntry(entry);
    setAnchorEl(event.currentTarget);
    setFlavorCompoundData([...flavorData]);
    setShowTooltip(true);
  };

  const handleMouseOut = () => {
    console.log("handleMouseOut");
    setShowTooltip(false);
  };

  return {
    mousePosition,
    showTooltip,
    flavorCompoundData,
    anchorEl,
    currentEntry,
    handleMouseHover,
    handleMouseOut,
  };
};
