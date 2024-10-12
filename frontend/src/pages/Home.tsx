import React from 'react';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';

// 配列にボタンのキャプションと色を保存
const button_caption = [
  { caption: 'Meat', color: '#B22222', 'key': 'meat' },
  { caption: 'Fish', color: '#4169E1', 'key': 'fish' },
  { caption: 'Vegetable', color: '#228B22', 'key': 'vegetable' },
  { caption: 'Fruit', color: '#B8860B', 'key': 'fruit' },
];

const Home: React.FC = () => {
  // 共通のデータストアとして、クリックされたボタンのキーを保存するための状態を管理
  const { selectedMainGroup, setSelectedMainGroup } = useAppContext(); 

  // 画面遷移
  const navigate = useNavigate();

  // ボタンがクリックされたときに呼ばれるハンドラ関数
  const handleButtonClick = (key: string) => {
    // 選択されたボタンのキーを状態に追加
    setSelectedMainGroup(key);
    navigate('/main-group'); 
  };

  return (
    <Container>
      <Typography variant="h4">
        Select your main item
      </Typography>
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
              color: '#fff',
              backgroundColor: color,
              aspectRatio: '1 / 1', // 正方形にする
              minHeight: '20px',  // ボタンの最小高さ
              maxHeight: '200px',  // ボタンの最大高さ
            }}
            onClick={() => handleButtonClick(key)} 
          >
            {caption}
          </Button>
        </Grid>
      ))}
    </Grid>
    </Container>
  );
};

export default Home;
