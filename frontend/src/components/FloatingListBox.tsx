import React from 'react';
import { Box, List, ListItem, Paper, Typography } from '@mui/material';
import { Entry } from 'src/api/types';

// 型定義: 親コンポーネントからアイテムを受け取る
interface FloatingListBoxProps {
  items: Entry[];
}

const FloatingListBox: React.FC<FloatingListBoxProps> = ({ items }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '160px',
        right: '20px',
        zIndex: 1000,
        borderColor: 'grey.500',
        borderRadius: 1,
        boxShadow: 3,
        backgroundColor: 'white',
        minWidth: '300px',
        minHeight: '300px',
      }}
    >
        <Typography
        align="center"
        variant="subtitle1"
        >Picked Ingredients</Typography>
        <Paper elevation={3}>
        <List>
          {items.map((entry, index) => (
            <ListItem 
            key={index}
            sx={{ fontSize: '16px' }}
            >{entry.name}</ListItem> 
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default FloatingListBox;