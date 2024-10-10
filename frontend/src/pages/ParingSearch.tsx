import React, { useState, useEffect } from 'react';  // React をインポート
import { useAppContext } from '../AppContext'; 
import { Container, Typography, TextField, Button, Checkbox } from '@mui/material';
import FixedButtonOverlay from '../components/FixedButtonOverlay';
import { useNavigate } from 'react-router-dom';
import { getEntryDataWithCategoryGroup, getMatchedParingEntries } from '../api/neo4j';
import { Entry } from '../api/types';

const ParingSearch: React.FC = () => {
  const { selectedMainGroup, selectedMainItems, selectedGroup } = useAppContext();  
  const navigate = useNavigate();
  
  // `result` の状態を作成
  const [matchedResult, setResult] = useState<Entry[]>([]);  // Entry型の配列を保存する状態

  // `searchText` や `cate` が変更された時にデータを取得する
  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchedResult = await getMatchedParingEntries(selectedMainItems, selectedGroup);
        setResult(matchedResult ?? []);  // 取得した結果を状態に保存
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 
  
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
