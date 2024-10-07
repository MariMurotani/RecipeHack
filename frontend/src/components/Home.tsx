import React from 'react';
import { Container, Typography, Button, Grid, Box } from '@mui/material';

// 配列にボタンのキャプションと色を保存
const button_caption = [
  { caption: 'Meat', color: 'primary', 'key': 'meat' },
  { caption: 'Fish', color: 'secondary', 'key': 'fish' },
  { caption: 'Vegetable', color: 'success', 'key': 'vegetable' },
  { caption: 'Fruit', color: 'error', 'key': 'fruit' },
];

  // ボタンがクリックされたときに呼ばれるハンドラ関数
  const handleButtonClick = (key: string) => {
    console.log(`${key} button clicked`);
    // 他の処理をここに追加できます
  };


const Home: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
      Please choose the main ingredient
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
          sx={{
            paddingLeft: 2,
            paddingRight: 2,
          }}
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
