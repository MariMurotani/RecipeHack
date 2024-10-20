import React from 'react';
import { Lightbulb } from '@mui/icons-material';
import { Typography, Box } from '@mui/material';

interface LightbulbTypographyProps {
  text: string; // テキストを引数として指定
}

const LightbulbTypography: React.FC<LightbulbTypographyProps> = ({ text }) => {
  return (
    <Box display="flex" alignItems="center" margin="20px">
      <Lightbulb fontSize="small" style={{ marginRight: '8px' }} />
      <Typography variant="h6">
        {text}
      </Typography>
    </Box>
  );
};

export default LightbulbTypography;
