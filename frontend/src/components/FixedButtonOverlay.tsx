import React from 'react';
import { Button } from '@mui/material';
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';

interface FixedButtonOverlayProps {
  onClick: () => void;  // 外部から渡されるクリック時の関数
  binding_position?: 'left' | 'right';  // ボタンの位置（'left' または 'right'）
  
}

const FixedButtonOverlay: React.FC<FixedButtonOverlayProps> = ({ onClick, binding_position = 'right' }) => {
  
  const style_param: React.CSSProperties = {
    position: 'fixed',
    top: '100px',
    zIndex: 1000,  // オーバーレイ表示のためにz-indexを設定
  };

  // 左右の位置をbinding_positionに応じて設定
  if (binding_position === 'left') {
    style_param.left = '20px';
  } else {
    style_param.right = '20px';  // rightを設定
  }
  const IconComponent = binding_position === 'left' ? ArrowBackIos : ArrowForwardIos;

  return (
    <Button
      variant="contained"
      color="primary"
      style={style_param}
      onClick={onClick}
      startIcon={<IconComponent />}
    >
    </Button>
  );
};

export default FixedButtonOverlay;
