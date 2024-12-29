import React from 'react';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import PageContainer from '../components/PageContainer';
import LightbulbTypography from '../components/LightbulbTypography';

// 配列にボタンのキャプションと色を保存
const button_caption = [
  { caption: 'Meat-  肉', color: '#B22222', 'key': 'Meat' },
  { caption: 'Fish or Shellfish - 魚や貝', color: '#4169E1', 'key': 'Fish' },
  { caption: 'Vegetables - 野菜', color: '#228B22', 'key': 'Vegetables' },
  { caption: 'Fruits - フルーツ', color: '#B8860B', 'key': 'Fruits' },
  { caption: 'Others - その他', color: '#800000', 'key': 'Others' },
  { caption: '', color: 'transparent', key: 'dummy1' }
];

const Home: React.FC = () => {
  // 共通のデータストアとして、クリックされたボタンのキーを保存するための状態を管理
  const { setSelectedMainGroup, setSelectedMainItems, setSelectedGroups, setSelectedAdditionalEntries } = useAppContext();  

  // FIXME: 初期化
  //setSelectedMainGroup("");
  //setSelectedMainItems([]);
  //setSelectedGroups([]);
  //setSelectedAdditionalEntries([]);

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
      <PageContainer>
        <LightbulbTypography text="メインディッシュを選択してください" />
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
                color: caption ? '#fff' : 'transparent', // ダミーは透明
                backgroundColor: caption ? color : 'transparent', // 背景も透明
                aspectRatio: '1 / 1', // 正方形にする
                minHeight: '20px',  // ボタンの最小高さ
                maxHeight: '200px',  // ボタンの最大高さ
                boxShadow: caption ? undefined : 'none', // ダミーは影を消す
                pointerEvents: caption ? 'auto' : 'none', // ダミーはクリック不可にする
              }}
              onClick={() => handleButtonClick(key)} 
            >
              {caption}
            </Button>
          </Grid>
        ))}
      </Grid>
      </PageContainer>
    </Container>
  );
};

export default Home;
