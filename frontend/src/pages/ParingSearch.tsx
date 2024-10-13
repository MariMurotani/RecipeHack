import React, { useState, useEffect } from 'react';  // React をインポート
import { useAppContext } from '../AppContext'; 
import { Container, Typography, TextField, Button, Checkbox, Box, Chip } from '@mui/material';
import FixedButtonOverlay from '../components/FixedButtonOverlay';
import FloatingListBox from '../components/FloatingListBox';
import { useNavigate } from 'react-router-dom';
import { getMatchedParingEntries } from '../api/neo4j';
import { Category, Entry } from '../api/types';

const ParingSearch: React.FC = () => {
  const { selectedMainGroup, selectedMainItems, selectedGroups, selectedAdditionalEntries, setSelectedAdditionalEntries } = useAppContext();  
  const navigate = useNavigate();
  
  const [matchedCategory, setMatchedCategory] = useState<Category[]>([]);  // Entry型の配列を保存する状態
  const [matchedResult, setResult] = useState<Entry[]>([]);  // Entry型の配列を保存する状態
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // 詳細フィルタ用のカテゴリ
  const [isChecked, setIsChecked] = useState<{ [key: string]: boolean }>({}); // チェックボックスのステート管理専用

  // `searchText` や `cate` が変更された時にデータを取得する
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { categories, entryResult } = await getMatchedParingEntries([...selectedMainItems, ...selectedAdditionalEntries], selectedGroups, selectedCategory);
        setMatchedCategory(categories);
        setResult(entryResult);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedCategory]); 
  
  // チェックボックス初期値
  useEffect(() => {
    const initialCheckedState = selectedAdditionalEntries.reduce((acc: { [key: string]: boolean }, entry: Entry) => {
      acc[entry.id] = true;
      return acc;
    }, {});
    setIsChecked(initialCheckedState);
  }, [selectedAdditionalEntries]);

  // カテゴリ用のチップがクリックされたとき
  const handleChipClick = (category_id: string) => {
    setSelectedCategory(category_id);
  }
  
  // 次へボタンがクリックされたとき
  const buttonOnClick = () => {
    navigate('/constitution');
  };

  // リストが選択されたとき
  const handleItemClick = (entry: Entry, event: React.ChangeEvent<HTMLInputElement>) => {
    const entry_exist = selectedAdditionalEntries.includes(entry);
    if(event.target.checked && !entry_exist){
      setSelectedAdditionalEntries([...selectedAdditionalEntries, entry]);
    } else if(!event.target.checked && entry_exist){
      setSelectedAdditionalEntries(selectedAdditionalEntries.filter(item => item !== entry));
    }
  };

  // selectedMainGroup が空の場合はリダイレクト
  useEffect(() => {
    if (selectedMainGroup == null) {
      navigate('/');
    }
  }, [selectedMainGroup, navigate]);

  return (
    <Container>
      <Typography variant="h4">
        Select paring items from the list below.
        <FixedButtonOverlay onClick={buttonOnClick} />
        <FloatingListBox items={selectedAdditionalEntries} />
      </Typography>
      <Box
      sx={{
        display: 'flex',
        gap: 1, // ラベル間のスペース
        flexWrap: 'wrap', // ラベルが画面サイズに応じて折り返される
      }}
    >
      {matchedCategory.map((item) => (
        <Chip
          key={`ch_${item.id}`}
          label={item.name}
          variant="outlined"
          onClick={() => handleChipClick(item.id)} 
        />
      ))}
        {selectedCategory !== '' && (<Chip
          key={`ch_all`}
          label='All'
          variant="outlined"
          onClick={() => handleChipClick('')}
        />)}
    </Box>
      <ul>
        {matchedResult.map((entry) => (
          <li key={`li${entry.id}`}
          style={{
            listStyleType: 'none',
          }}>
            <Checkbox 
            key={`ch_${entry.id}`} 
            size="small" 
            checked={isChecked[entry.id] || false}  
            onChange={(event) => handleItemClick(entry, event)} />
            {entry.name} - {entry.scientific_name} ({entry.distance})
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default ParingSearch;
