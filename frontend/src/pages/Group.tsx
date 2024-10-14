import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid, Box, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import FixedButtonOverlay from '../components/FixedButtonOverlay';
import PageContainer from '../components/PageContainer';

// 配列にボタンのキャプションと色を保存
const button_caption = [
  { caption: 'Earth', color: 'primary', 'key': 'earth' },
  { caption: 'Green', color: 'secondary', 'key': 'green' },
  { caption: 'Tropical', color: 'success', 'key': 'tropical' },
  { caption: 'Ocean', color: 'error', 'key': 'ocean' },
  { caption: 'Mountain', color: 'error', 'key': 'mountain' },
  { caption: 'Field', color: 'error', 'key': 'field' },
  { caption: 'Spice & Herbs', color: 'error', 'key': 'spice' }, // ここから外して後で選べるようにすことを検討する
  { caption: 'Oil', color: 'error', 'key': 'oil' },// ここから外して後で選べるようにする
  { caption: 'Drink', color: 'error', 'key': 'drink' },// ここから外して後で選べるようにする
];

const Group: React.FC = () => {
  // 共通のデータストアとして、クリックされたボタンのキーを保存するための状態を管理
  const { selectedGroups, setSelectedGroups } = useAppContext();  
  const [isChecked, setIsChecked] = useState<{ [key: string]: boolean }>({}); // チェックボックスのステート管理専用

  const navigate = useNavigate();

  // チェックボックス初期値
  useEffect(() => {
    const initialCheckedState = selectedGroups.reduce((acc: { [key: string]: boolean }, group: string) => {
      acc[group] = true;
      return acc;
    }, {});
    setIsChecked(initialCheckedState);
  }, [selectedGroups]);
  

  // ボタンがクリックされたときに呼ばれるハンドラ関数
  const handleButtonClick = () => {
    navigate('/paring_search');
  };

  // リストが選択されたとき
  const handleItemClick = (key: string, event:React.ChangeEvent<HTMLInputElement>) => {
    const entry_exist = selectedGroups.includes(key);
    if(event.target.checked && !entry_exist){
      setSelectedGroups([...selectedGroups, key]);
    } else if(!event.target.checked && entry_exist){
      setSelectedGroups(selectedGroups.filter(item => item !== key));
    }
  };
  
  return (
    <Container>
      <PageContainer>
        <Typography variant="h4" gutterBottom>
          <div> Choose taste of your dish </div>
        <FixedButtonOverlay onClick={handleButtonClick} />
        </Typography>
        {/* 取得した結果をリストとして表示 */}
        <ul>
          {button_caption.map((button) => (
            <li key={`li_${button.key}`}
            style={{
              listStyleType: 'none',
            }}>
              <Checkbox 
              key={`ch_${button.key}`} 
              size="small" 
              checked={isChecked[button.key] || false}
              onChange={(event) => handleItemClick(button.key, event)} />
              {button.caption}
            </li>
          ))}
        </ul>
      </PageContainer>
    </Container>
  );
};

export default Group;
