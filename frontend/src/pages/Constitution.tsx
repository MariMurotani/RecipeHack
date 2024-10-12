import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Button, Box, Tab, Tabs } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import DoubleCircularBarPlot, { FlavorPairDataType } from '../components/DoubleCircularBarPlot';
import NetworkGraph, { DataNode } from '../components/NetworkGraph';
import { calculateScores, sortAndSliceTopN, maxScale } from '../api/calcFunction';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { createSharedFlavorEdges, extractLocalCoefficient } from '../api/neo4j';
import { Coefficient } from 'src/api/types';

const Constitution: React.FC = () => {
  // 共通のデータストアとして、クリックされたボタンのキーを保存するための状態を管理
  const { selectedMainGroup, selectedMainItems, selectedGroups, selectedAdditionalEntries } = useAppContext();  
  // タブの状態を管理するためのuseState
  const [tabNumber, setTabNumber] = useState<string>('1');
  // ネットワークグラフ用のデータを保持
  const [coefficientData, setCoefficientData] = useState<DataNode[]>([]);
  // 円バーグラフ用のデータを保持
  const [doubleBarData, setDoubleBarData] = useState<FlavorPairDataType[]>([]);
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabNumber(newValue);
  };

  // 食材ペアの分析
  const processCoefficients = async () => {
    try {
      await createSharedFlavorEdges([...selectedMainItems, ...selectedAdditionalEntries]);
      const graphCoefResult: Coefficient[] = await extractLocalCoefficient([...selectedMainItems, ...selectedAdditionalEntries]);
  
      let graphNetData: DataNode[] = [];
  
      graphCoefResult.forEach(({ e1, e2, count }) => {
        let existingEntry = graphNetData.find(item => item.name === e1.name);
        if (existingEntry) {
          existingEntry.size += Number(count);
          existingEntry.imports.push(e2.name);
        } else {
          graphNetData.push({
            name: e1.name,
            size: Number(count),
            imports: [e2.name],
          });
        }
  
        let existingEntry2 = graphNetData.find(item => item.name === e2.name);
        if (existingEntry2) {
          existingEntry2.size += Number(count);
          existingEntry2.imports.push(e1.name);
        } else {
          graphNetData.push({
            name: e2.name,
            size: Number(count),
            imports: [e1.name],
          });
        }
      });
  
      console.log([...graphNetData]);
      setCoefficientData([...graphNetData]);
    } catch (error) {
      console.error("Error processing coefficients:", error);
    }
  };
  

  // 香りのペアの分析
  const processFlavorParing = async () => {
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
    setDoubleBarData(graphData);
  };

  useEffect(() => {
    // 共起分析
    processCoefficients();
    console.log(coefficientData);
    processFlavorParing();
  }, [selectedMainItems, selectedAdditionalEntries]); 

    const neo_dummy_data = [
      {
        "name": "egg",
        "size": 12,
        "imports": [
            "chive",
            "soy yogurt"
        ]
    },
    {
        "name": "chive",
        "size": 2,
        "imports": []
    },
    {
        "name": "soy yogurt",
        "size": 120,
        "imports": []
    },
    {
        "name": "recruiterB",
        "size": 19,
        "imports": []
    },
    {
        "name": "engineerA",
        "size": 121,
        "imports": []
    },
    {
        "name": "engineerB",
        "size": 127,
        "imports": [
            "engineerA"
        ]
    }
    ];
    
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
          {coefficientData.length > 0 && (<NetworkGraph data={coefficientData} />)}
        </TabPanel>
        <TabPanel value="2" sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <DoubleCircularBarPlot data={doubleBarData} />
        </TabPanel>
        <TabPanel value="3" sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Item Three
        </TabPanel>
      </TabContext>
    </Container>
  );
};

export default Constitution;

