import React from 'react';
import { Container, Typography, Button, Grid, Box, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { Entry } from 'src/api/types';
import FixedButtonOverlay from '../components/FixedButtonOverlay';

// 配列にボタンのキャプションと色を保存
const button_caption = [
  { caption: 'Earth', color: 'primary', 'key': 'earth' },
  { caption: 'Green', color: 'secondary', 'key': 'green' },
  { caption: 'Tropical', color: 'success', 'key': 'tropical' },
  { caption: 'Ocean', color: 'error', 'key': 'ocean' },
  { caption: 'Mountain', color: 'error', 'key': 'mountain' },
  { caption: 'Field', color: 'error', 'key': 'field' },
  { caption: 'Spice & Herbs', color: 'error', 'key': 'spice' }, // ここから外して後で選べるようにすことを検討する
  { caption: 'Oil', color: 'error', 'key': 'Oil' },// ここから外して後で選べるようにする
];

const Group: React.FC = () => {
  // 共通のデータストアとして、クリックされたボタンのキーを保存するための状態を管理
  const { selectedGroups, setSelectedGroups } = useAppContext();  
  const navigate = useNavigate();


  // ボタンがクリックされたときに呼ばれるハンドラ関数
  const handleButtonClick = () => {
    navigate('/paring_search');
  };

  // リストが選択されたとき
  const handleItemClick = (key: string, event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    console.log(`handle button clicked: ${key}`);
    // 選択されたボタンのキーを状態に追加
    setSelectedGroups([...selectedGroups, key]);
  };
  

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        <div> Choose taste of your dish </div>
      <FixedButtonOverlay onClick={handleButtonClick} />
      </Typography>
      {/* 取得した結果をリストとして表示 */}
      <ul>
        {button_caption.map((button) => (
          <a key={`a_${button.key}`} onClick={(event) => handleItemClick(button.key, event)}>
            <li key={`li_${button.key}`}>
              <Checkbox key={`ch_${button.key}`} size="small" />
              {button.caption}
            </li>
          </a>
        ))}
      </ul>

    </Container>
  );
};

export default Group;
