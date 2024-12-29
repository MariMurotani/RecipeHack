import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid, Box, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import FixedButtonOverlay from '../components/FixedButtonOverlay';
import PageContainer from '../components/PageContainer';
import LightbulbTypography from '../components/LightbulbTypography';

// 配列にボタンのキャプションと色を保存
const button_caption = [
  { caption: 'Earth - 土', color: '#8B4513', key: 'Earth' },
  { caption: 'Green - 緑', color: '#556B2F', key: 'Green' },
  { caption: 'Tropical - トロピカル', color: '#D2691E', key: 'Tropical' },
  { caption: 'Ocean - 海', color: '#4682B4', key: 'Ocean' },
  { caption: 'Mountain - 山', color: '#2E8B57', key: 'Mountain' },
  { caption: 'Pasture - 牧草地', color: '#2E8B57', key: 'Pasture' },
  { caption: 'Field - 畑', color: '#C2B280', key: 'Field' },
  { caption: 'Spice & Herbs - スパイスとハーブ', color: '#8B0000', key: 'Spice & Herbs' },
  { caption: 'Oil - オイル', color: '#BDB76B', key: 'Oil' },
  { caption: 'Drink - 飲み物', color: '#6B8E23', key: 'Drink' },
  { caption: 'Others - その他', color: '#708090', key: 'Other' }
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
        <LightbulbTypography text="何を合わせたいですか？" />
        <FixedButtonOverlay onClick={handleButtonClick} />
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
