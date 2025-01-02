import React, { useState, useEffect } from 'react';  // React をインポート
import { useAppContext } from '../AppContext'; 
import { Container, Typography, TextField, Button, Checkbox, Box, Chip } from '@mui/material';
import PageContainer from '../components/PageContainer';
import FixedButtonOverlay from '../components/FixedButtonOverlay';
import FloatingListBox from '../components/FloatingListBox';
import { useNavigate } from 'react-router-dom';
import { getMatchedParingEntries, fetchAromaCompoundWithEntry } from '../api/neo4j';
import { AromaCompound, Category, Entry } from '../api/types';
import LightbulbTypography from '../components/LightbulbTypography';
import EntryGraphToolTip from '../components/EntryGraphTooltip';
import { FlavorCompoundDataType } from "../hooks/useD3PieChart";

const ParingSearch: React.FC = () => {
  const { selectedMainGroup, selectedMainItems, selectedGroups, selectedAdditionalEntries, setSelectedAdditionalEntries } = useAppContext();  
  const navigate = useNavigate();
  
  const [matchedCategory, setMatchedCategory] = useState<Category[]>([]);  // Entry型の配列を保存する状態
  const [matchedResult, setResult] = useState<Entry[]>([]);  // Entry型の配列を保存する状態
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // 詳細フィルタ用のカテゴリ
  const [isChecked, setIsChecked] = useState<{ [key: string]: boolean }>({}); // チェックボックスのステート管理専用
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 }); // マウスの位置を保存する状態
  const [showTooltip, setShowTooltip] = useState<boolean>(false); // ツールチップの表示/非表示を制御する状態
  const [flavorCompoundData, setFlavorCompoundData] = useState<FlavorCompoundDataType[]>([]); // Aroma構成を保存する状態
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null); // ツールチップをマウントするAnchor
  const [currentEntry, setCurrentEntry] = React.useState<Entry|null>(null); // ツールチップをマウントするAnchor

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
  };

  // フローティングリストのバツボタン
  const handleSelectedListDelete = (entry: Entry) => {
    setSelectedAdditionalEntries(selectedAdditionalEntries.filter(item => item !== entry));
  };
  
  // 次へボタンがクリックされたとき
  const nextButtonOnClick = () => {
    navigate('/constitution');
  };
  
  // 前へボタンがクリックされたとき
  const backButtonOnClick = () => {
    navigate('/group');
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

  // マウスホバーされたとき
  const handleMouseHover = async (event: React.MouseEvent<HTMLLIElement, MouseEvent>, entry: Entry) => {
    const aromaCompounds:AromaCompound[] = await fetchAromaCompoundWithEntry(entry.id);
    const flavorData: FlavorCompoundDataType[] = aromaCompounds.map((aroma) => ({
      flavorName: aroma.name,
      ratio: aroma.average_ratio,
      color: aroma.color ?? "#000000",
    }));
    const scrollOffsetY = window.scrollY || document.documentElement.scrollTop;
    const scrollOffsetX = window.scrollX || document.documentElement.scrollLeft;
  
    setMousePosition({
      x: event.clientX + scrollOffsetX, // 水平方向のスクロールを考慮
      y: event.clientY + scrollOffsetY, // 垂直方向のスクロールを考慮
    });
    setCurrentEntry(entry);
    setAnchorEl(event.currentTarget);
    setFlavorCompoundData([...flavorData]);
    setShowTooltip(true);
  };
  
  // マウスホバーが外れたとき
  const handleMouseOut = () => {
    console.log('mouse out');
    setShowTooltip(false);
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
        <LightbulbTypography text="Select paring items from the list below." />
        <FixedButtonOverlay onClick={backButtonOnClick} binding_position="left" />
        <FixedButtonOverlay onClick={nextButtonOnClick} />
        <FloatingListBox items={[...selectedMainItems,...selectedAdditionalEntries]} handleDelete={handleSelectedListDelete} />
        {(flavorCompoundData.length > 0) &&  <
          EntryGraphToolTip data={flavorCompoundData} 
          mousePosition={mousePosition}
          anchorEl={anchorEl}
          title={currentEntry?.name ?? ""}
          />}
        <Box
        sx={{
          display: 'flex',
          gap: 1, // ラベル間のスペース
          flexWrap: 'wrap', // ラベルが画面サイズに応じて折り返される
          maxWidth: '600px', // ボックスの最大幅
        }}
      >
          {matchedCategory.map((item) => (
            <Chip
              key={`ch_${item.id}`}
              label={item.name_ja || item.name}
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
        <Box
            onMouseOut={() => handleMouseOut()}>
          <ul>
            {matchedResult.map((entry) => (
              <li key={`li${entry.id}`}
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
                {entry.name} - {entry.name_ja} (f: {entry.flavor_score}, w: {entry.word_score}, c: {entry.count}, kn: ({entry.key_notes.join(', ')}))
              </li>
            ))}
          </ul>
        </Box>
        </PageContainer>
    </Container>
  );
};

export default ParingSearch;
