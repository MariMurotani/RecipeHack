import React, { useState } from 'react';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// 配列にボタンのキャプションと色を保存
const button_caption = [
  { caption: 'Meat', color: 'primary', 'key': 'meat' },
  { caption: 'Fish', color: 'secondary', 'key': 'fish' },
  { caption: 'Vegetable', color: 'success', 'key': 'vegetable' },
  { caption: 'Fruit', color: 'error', 'key': 'fruit' },
];

const Home: React.FC = () => {
  // 共通のデータストアとして、クリックされたボタンのキーを保存するための状態を管理
  const [selectedMainGroup, setSelectedMainGroup] = useState<string>('');

  // 画面遷移
  const navigate = useNavigate();

  // ボタンがクリックされたときに呼ばれるハンドラ関数
  const handleButtonClick = (key: string) => {
    console.log(`${key} button clicked`);
    // 選択されたボタンのキーを状態に追加
    setSelectedMainGroup(key);
    navigate('/main-group'); 
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
      Please choose the category of main ingredient
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

export default Home;
