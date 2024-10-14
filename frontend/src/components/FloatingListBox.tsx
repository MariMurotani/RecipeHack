import React, { useState } from 'react';
import { Box, List, ListItem, Paper, Typography, IconButton, Slide } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; // 閉じている時
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';   // 開いている時
import { Entry } from 'src/api/types';

// 型定義: 親コンポーネントからアイテムを受け取る
interface FloatingListBoxProps {
  items: Entry[];
}

const FloatingListBox: React.FC<FloatingListBoxProps> = ({ items }) => {
  const [open, setOpen] = useState(true); // 開閉状態を管理

  const toggleList = () => {
    setOpen(!open);
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
      <IconButton onClick={toggleList} sx={{ position: 'absolute', left: '-40px', top: '10px' }}>
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
          <Paper elevation={3}>
            <List>
              {items.map((entry, index) => (
                <ListItem key={index} sx={{ fontSize: '16px' }}>
                  {entry.name}
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
