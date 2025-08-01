import React, { useState } from 'react';
import { Box, List, ListItem, Paper, Typography, IconButton, Slide } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; // 閉じている時
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';   // 開いている時
import EntryGraphToolTip from '../components/EntryGraphTooltip';
import HintTooltip from '../components/HintTooltip';
import CloseIcon from '@mui/icons-material/Close'; // バツボタン
import { Entry } from 'src/api/types';
import { useTooltipHandler } from "../hooks/useTooltipHandler";
import PieChartIcon from "@mui/icons-material/PieChart";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { useAppContext } from '../AppContext';

// 型定義: 親コンポーネントからアイテムを受け取る
interface FloatingListBoxProps {
  items: Entry[];
  handleDelete: (entry: Entry) => void;
}

const FloatingListBox: React.FC<FloatingListBoxProps> = ({ items, handleDelete }) => {
  const { selectedMainItems, setSelectedMainItems } = useAppContext();  
  const [open, setOpen] = useState(true);

  const toggleList = () => {
    setOpen(!open);
  };

  const {
      tooltipType,
      mousePosition,
      showTooltip,
      flavorCompoundData,
      hintData,
      anchorEl,
      currentEntry,
      handleMouseHover,
      handleMouseOut,
    } = useTooltipHandler();
  
    const handleMouseClick = (entry: Entry) => {
      setSelectedMainItems([...selectedMainItems, entry]);    
    };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '120px',
        right: '20px',
        zIndex: 1000,
      }}
    >
      {/* 開閉用のボタン */}
      <IconButton 
        color="primary"
        onClick={toggleList} sx={{ position: 'absolute', left: '-40px', top: '10px' }}>
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />} {/* 開閉状態に応じてアイコンを切り替え */}
      </IconButton>

      {/* リストの表示部分 */}
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
        <Box
          sx={{
            borderColor: 'grey.500',
            borderRadius: 1,
            boxShadow: 3,
            backgroundColor: 'white',
            minWidth: '300px',
            minHeight: '300px',
            overflow: 'hidden',
          }}
        >
          <Typography align="center" variant="subtitle1">Picked Ingredients</Typography>
          {/* ツールチップ */}
          {tooltipType === "Pie" && (flavorCompoundData.length > 0) &&  
            <EntryGraphToolTip
              flavorCompoundDataType={flavorCompoundData} 
              mousePosition={mousePosition}
              anchorEl={anchorEl}
              title={currentEntry?.name ?? ""}
              show={showTooltip}
              onClose={handleMouseOut}
              sx={{
                zIndex: 3000
              }}
            />
          }
          {tooltipType === "Hint" && (
            <HintTooltip 
              recipeRankResults={hintData} 
              mousePosition={mousePosition}
              anchorEl={anchorEl}
              title={currentEntry?.name ?? ""}
              show={showTooltip}
              onClose={handleMouseOut}
              onClick={handleMouseClick}
              sx={{
                zIndex: 3000
              }}
            />
          )}
          <Paper elevation={3}>
            <List>
              {items.map((entry, index) => (
                <ListItem 
                  key={index}
                  sx={{ fontSize: '16px' }}
                  >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <PieChartIcon 
                      onMouseEnter={(event) => handleMouseHover(event, entry, "Pie")}
                      sx={{ fontSize:'18px', paddingRight: '5px' }}                    
                    />
                    <LightbulbIcon 
                      onMouseEnter={(event) => handleMouseHover(event, entry, "Hint")}
                      sx={{ fontSize:'18px', paddingRight: '5px' }} 
                    />
                    <Typography sx={{ flexGrow: 1 }}>{entry.name}</Typography>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(entry)}  // バツボタンが押された時の処理
                    >
                      <CloseIcon />
                    </IconButton>  {/* 右側にバツボタンを配置 */}
                  </div>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Slide>
    </Box>
  );
};

export default FloatingListBox;
