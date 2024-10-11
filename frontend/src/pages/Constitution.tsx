import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Button, Box, Tab, Tabs } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import DoubleCircularBarPlot, { FlavorPairDataType } from '../components/DoubleCircularBarPlot';
import { normalizeDistances } from 'src/api/neo4j';
import { calculateScores, sortAndSliceTopN, maxScale } from '../api/calcFunction';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { createSharedFlavorEdges } from '../api/neo4j';

const Constitution: React.FC = () => {
  // 共通のデータストアとして、クリックされたボタンのキーを保存するための状態を管理
  const { selectedMainGroup, selectedMainItems, selectedGroups, selectedAdditionalEntries } = useAppContext();  
  // タブの状態を管理するためのuseState
  const [tabNumber, setTabNumber] = useState('1');
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabNumber(newValue);
  };

  // ペアリングの分析
  const result = createSharedFlavorEdges([...selectedMainItems, ...selectedAdditionalEntries])
  console.log(result);
  
  // ペアリングのスコアなどを合計する
  const { paringScore, flavorCount } = calculateScores(selectedMainItems, selectedAdditionalEntries);
  let sortedParingScore = sortAndSliceTopN(paringScore, 15);
  let sortedFlavorCount = sortAndSliceTopN(flavorCount, 15);
  let normalizedParingScore = maxScale(sortedParingScore, 6000);
  let normalizedFlavorCount = maxScale(sortedFlavorCount, 6000);
  const graphData: FlavorPairDataType[] = normalizedParingScore.map((item, index) => {
      return {
        Flavor: item[0], // FlavorはsortedParingScoreのキー（文字列）
        v1: item[1],     // v1はsortedParingScoreの値（数値）
        v2: normalizedFlavorCount[index][1] // v2はsortedFlavorCountから対応する数値
      };
    });


  return (
    <Container>
      <TabContext value={tabNumber}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="lab API tabs example" sx={{ justifyContent: 'center' }}>
          <Tab label="Collation" value="1" />
          <Tab label="Pairing" value="2" />
          </TabList>
        </Box>

        {/* TabPanelの横幅を100%、コンテンツをセンタリング */}
        <TabPanel value="1" sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        </TabPanel>
        <TabPanel value="2" sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <DoubleCircularBarPlot data={graphData} />
        </TabPanel>
        <TabPanel value="3" sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Item Three
        </TabPanel>
      </TabContext>
    </Container>
  );
};

export default Constitution;

