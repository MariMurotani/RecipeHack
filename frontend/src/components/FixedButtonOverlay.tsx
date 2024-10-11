import React from 'react';
import { Button } from '@mui/material';  // MUIのボタンコンポーネントを使用

interface FixedButtonOverlayProps {
  onClick: () => void;  // 外部から渡されるクリック時の関数
}

const FixedButtonOverlay: React.FC<FixedButtonOverlayProps> = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      style={{
        position: 'fixed',
        top: '100px',
        right: '20px',
        zIndex: 1000,  // オーバーレイ表示のためにz-indexを設定
      }}
      onClick={onClick}  // 外部から渡された関数を使用
    >
      Next
    </Button>
  );
};

export default FixedButtonOverlay;
