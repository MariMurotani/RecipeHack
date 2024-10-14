import React from 'react';
import { Box } from '@mui/material';

interface ContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<ContainerProps> = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        top: '40px',
        width: '100%',
        minHeight: 'calc(100vh - 100px)', // 100px分を引いた高さを自動調整
        padding: '20px', // 任意でpaddingを追加
        boxSizing: 'border-box', // 要素内のコンテンツが枠内に収まるようにする
      }}
    >
      {children}
    </Box>
  );
};

export default PageContainer;
