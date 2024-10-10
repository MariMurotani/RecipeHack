import React, { useState, useEffect } from 'react';  // React をインポート
import { useAppContext } from '../AppContext'; 
import { Container, Typography, TextField, Button, Checkbox, Box, Chip } from '@mui/material';
import FixedButtonOverlay from '../components/FixedButtonOverlay';
import { useNavigate } from 'react-router-dom';
import { getEntryDataWithCategoryGroup, getMatchedParingEntries } from '../api/neo4j';
import { Category, Entry } from '../api/types';

const ParingSearch: React.FC = () => {
  const { selectedMainGroup, selectedMainItems, selectedGroup } = useAppContext();  
  const navigate = useNavigate();
  
  // `result` の状態を作成
  const [matchedCategory, setMatchedCategory] = useState<Category[]>([]);  // Entry型の配列を保存する状態
  const [matchedResult, setResult] = useState<Entry[]>([]);  // Entry型の配列を保存する状態

  // `searchText` や `cate` が変更された時にデータを取得する
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getMatchedParingEntries(selectedMainItems, selectedGroup);
        const { categories, entryResult } = await getMatchedParingEntries(selectedMainItems, selectedGroup);
        setMatchedCategory(categories);
        setResult(entryResult);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 
  
  // カテゴリ用のチップがクリックされたとき
  const handleChipClick = (category: Category) => {
    console.log(category)
  }
  
  // 次へボタンがクリックされたとき
  const buttonOnClick = () => {
    /// navigate('/group');
  };

  // リストが選択されたとき
  const handleItemClick = (entry: Entry, event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    console.log(entry)
    /// setSelectedMainItems([...selectedMainItems, entry]);
  };

  // selectedMainGroup が空の場合はリダイレクト
  useEffect(() => {
    if (selectedMainGroup == null) {
      navigate('/');
    }
  }, [selectedMainGroup, navigate]);

  return (
    <Container>
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
          sx={{ borderRadius: '16px' }}
          onClick={() => handleChipClick(item)} 
        />
      ))}
    </Box>
      <ul>
        {matchedResult.map((entry) => (
          <a onClick={(event) => handleItemClick(entry, event)}>
            <li key={entry.id}>
              <Checkbox size="small" />
              {entry.name} - {entry.scientific_name}
            </li>
          </a>
        ))}
      </ul>
    </Container>
  );
};

export default ParingSearch;
