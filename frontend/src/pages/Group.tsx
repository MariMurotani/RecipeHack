import React from 'react';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';

// 配列にボタンのキャプションと色を保存
const button_caption = [
  { caption: 'Earth', color: 'primary', 'key': 'meat' },
  { caption: 'Green', color: 'secondary', 'key': 'fish' },
  { caption: 'Tropical', color: 'success', 'key': 'vegetable' },
  { caption: 'Ocean', color: 'error', 'key': 'fruit' },
  { caption: 'Mountain', color: 'error', 'key': 'fruit' },
  { caption: 'Field', color: 'error', 'key': 'fruit' },
  { caption: 'Spice', color: 'error', 'key': 'fruit' }, // ここから外して後で選べるようにすことを検討する
  { caption: 'Oil', color: 'error', 'key': 'fruit' },// ここから外して後で選べるようにする
];

const Group: React.FC = () => {
  // 共通のデータストアとして、クリックされたボタンのキーを保存するための状態を管理
  const { selectedMainGroup, setSelectedMainGroup } = useAppContext(); 

  // 画面遷移
  const navigate = useNavigate();

  // ボタンがクリックされたときに呼ばれるハンドラ関数
  const handleButtonClick = (key: string) => {
    console.log(`${key} button clicked`);
    // 選択されたボタンのキーを状態に追加
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
      aaaaa
      </Typography>
      <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"  // 縦方向に中央揃え
    >
        <Grid
          container
          spacing={2}
          justifyContent="center"
        >
        {button_caption.map(({caption, color , key}) => (
          <Grid item xs={6} key={key}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                aspectRatio: '1 / 1', // 正方形にする
                minHeight: '20px',  // ボタンの最小高さ
              }}
              onClick={() => handleButtonClick(key)} 
            >
              {caption}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
    </Container>
  );
};

export default Group;
