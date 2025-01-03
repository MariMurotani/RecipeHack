import React, { useState, useEffect } from 'react';  // React をインポート
import { useAppContext } from '../AppContext'; 
import { Container, Typography, TextField, Button, Checkbox, IconButton } from '@mui/material';
import PageContainer from '../components/PageContainer';
import FixedButtonOverlay from '../components/FixedButtonOverlay';
import FloatingListBox from '../components/FloatingListBox';
import EntryGraphToolTip from '../components/EntryGraphTooltip';
import { useNavigate } from 'react-router-dom';
import { getEntryDataWithCategoryGroup } from '../api/neo4j';
import { Entry } from '../api/types';
import { useTooltipHandler } from "../hooks/useTooltipHandler";

const MainGroup: React.FC = () => {
  const { selectedMainGroup, selectedMainItems, setSelectedMainItems } = useAppContext();  
  const navigate = useNavigate();
  
  const [result, setResult] = useState<Entry[]>([]);  // Entry型の配列を保存する状態
  const [searchText, setSearchText] = useState<string>('');  // 検索テキストの状態
  const [isChecked, setIsChecked] = useState<{ [key: string]: boolean }>({}); // チェックボックスのステート管理専用
  const {
      mousePosition,
      showTooltip,
      flavorCompoundData,
      anchorEl,
      currentEntry,
      handleMouseHover,
      handleMouseOut,
    } = useTooltipHandler();
    
  // 初期値として `meat` を使用し、`result`を取得
  const cate = selectedMainGroup === "" ? "Meat" : selectedMainGroup;

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

  // チェックボックス初期値
  useEffect(() => {
    const initialCheckedState = selectedMainItems.reduce((acc: { [key: string]: boolean }, entry: Entry) => {
      acc[entry.id] = true;
      return acc;
    }, {});
    setIsChecked(initialCheckedState);
  }, [selectedMainItems]);
  
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

  // アイテム選択済みかどうか
  const isItemSelected = (entry: Entry) : string => {
    const entry_exist = selectedMainItems.includes(entry);
    return (entry_exist ? 'defaultChecked' : '');
  };

  // フローティングリストのバツボタン
  const handleSelectedListDelete = (entry: Entry) => {
    setSelectedMainItems(selectedMainItems.filter(item => item !== entry));
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
      <PageContainer>
        <Typography gutterBottom component="div">
          <FixedButtonOverlay onClick={buttonOnClick} />
          <FloatingListBox items={selectedMainItems} handleDelete={handleSelectedListDelete} />
          {(flavorCompoundData.length > 0) &&  <
            EntryGraphToolTip data={flavorCompoundData} 
            mousePosition={mousePosition}
            anchorEl={anchorEl}
            title={currentEntry?.name ?? ""}
          />}
        </Typography>

        {/* テキストボックスを配置 */}
        <TextField
          label="Find main ingredient"
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ width: '300px', top: '17px' }}
          value={searchText}
        />
        {/* 取得した結果をリストとして表示 */}
        <ul
          style={{ position: 'relative', top: '30px', left: '-40px' }}
          >
          {result.map((entry) => (
            <li key={`li_${entry.id}`}
            style={{
              listStyleType: 'none',
            }}
            onMouseOver={(event) => handleMouseHover(event, entry)}
            >
              <Checkbox 
              key={`ch_${entry.id}`} 
              size="small"  
              checked={isChecked[entry.id] || false}  
              onChange={(event) => handleItemClick(entry, event)} />
              {entry.name} - {entry.name_ja}
            </li>
          ))}
        </ul>
        </PageContainer>
    </Container>
  );
};

export default MainGroup;
