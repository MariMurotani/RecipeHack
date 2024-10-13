import React, { useState, useEffect } from 'react';  // React をインポート
import { useAppContext } from '../AppContext'; 
import { Container, Typography, TextField, Button, Checkbox } from '@mui/material';
import FixedButtonOverlay from '../components/FixedButtonOverlay';
import FloatingListBox from '../components/FloatingListBox';
import { useNavigate } from 'react-router-dom';
import { getEntryDataWithCategoryGroup } from '../api/neo4j';
import { Entry } from '../api/types';

const MainGroup: React.FC = () => {
  const { selectedMainGroup, selectedMainItems, setSelectedMainItems } = useAppContext();  
  const navigate = useNavigate();
  
  // `result` の状態を作成
  const [result, setResult] = useState<Entry[]>([]);  // Entry型の配列を保存する状態
  const [searchText, setSearchText] = useState<string>('');  // 検索テキストの状態

  // 初期値として `meat` を使用し、`result`を取得
  const cate = selectedMainGroup === "" ? "meat" : selectedMainGroup;

  // `searchText` や `cate` が変更された時にデータを取得する
  useEffect(() => {
    const fetchData = async () => {
      try {
        const newResult = await getEntryDataWithCategoryGroup(cate, searchText);
        setResult(newResult ?? []);  // 取得した結果を状態に保存
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [searchText, cate]);  // `searchText` または `cate` が変更されたときに再取得

  // テキストボックスの入力が変更されたときに呼ばれる
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchText(event.target.value);  // 検索テキストの状態を更新
  };

  // リストが選択されたとき
  const handleItemClick = (entry: Entry, event:React.ChangeEvent<HTMLInputElement>) => {
    const entry_exist = selectedMainItems.includes(entry);
    if(event.target.checked && !entry_exist){
      setSelectedMainItems([...selectedMainItems, entry]);
    } else if(!event.target.checked && entry_exist){
      setSelectedMainItems(selectedMainItems.filter(item => item !== entry));
    }
  };

  // 次へボタンがクリックされたとき
  const buttonOnClick = () => {
    navigate('/group');
  };

  // selectedMainGroup が空の場合はリダイレクト
  useEffect(() => {
    if (selectedMainGroup == null) {
      navigate('/');
    }
  }, [selectedMainGroup, navigate]);

  return (
    <Container>
      <Typography gutterBottom component="div">
        <FixedButtonOverlay onClick={buttonOnClick} />
        <FloatingListBox items={selectedMainItems} />
      </Typography>

      {/* テキストボックスを配置 */}
      <TextField
        label="Find main ingredient"
        onChange={handleChange}
        fullWidth
        variant="outlined"
        style={{ width: '300px' }}
        value={searchText}
      />
      {/* 取得した結果をリストとして表示 */}
      <ul>
        {result.map((entry) => (
          <li key={`li_${entry.id}`}
          style={{
            listStyleType: 'none',
          }}>
            <Checkbox key={`ch_${entry.id}`} size="small"  onChange={(event) => handleItemClick(entry, event)} />
            {entry.name} - {entry.scientific_name}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default MainGroup;
