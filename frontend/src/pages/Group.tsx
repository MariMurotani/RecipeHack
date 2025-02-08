import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid, Box, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import FixedButtonOverlay from '../components/FixedButtonOverlay';
import PageContainer from '../components/PageContainer';
import LightbulbTypography from '../components/LightbulbTypography';
import { FOOD_CATEGORIES } from '../api/constants';

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
          {FOOD_CATEGORIES.map((button) => (
            <li key={`li_${button.key}`}
            style={{
              listStyleType: 'none',
            }}>
              <Checkbox 
              key={`ch_${button.key}`} 
              size="small" 
              checked={isChecked[button.key] || false}
              onChange={(event) => handleItemClick(button.key, event)} />
              {button.label}
            </li>
          ))}
        </ul>
      </PageContainer>
    </Container>
  );
};

export default Group;
