import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Button, Box, Tab, Tabs } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import DoubleCircularBarPlot, { FlavorPairDataType } from '../components/DoubleCircularBarPlot';
import NetworkGraph, { DataNode } from '../components/NetworkGraph';
import { normalizeDistances } from 'src/api/neo4j';
import { calculateScores, sortAndSliceTopN, maxScale } from '../api/calcFunction';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { createSharedFlavorEdges, extractLocalCoefficient } from '../api/neo4j';

const Constitution: React.FC = () => {
  // 共通のデータストアとして、クリックされたボタンのキーを保存するための状態を管理
  const { selectedMainGroup, selectedMainItems, selectedGroups, selectedAdditionalEntries } = useAppContext();  
  // タブの状態を管理するためのuseState
  const [tabNumber, setTabNumber] = useState('1');
  // ネットワークグラフ用のデータを保持
  const [coefficientData, setCoefficientData] = useState('1');
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabNumber(newValue);
  };

  // `searchText` や `cate` が変更された時にデータを取得する
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ペアリングの分析
        console.log("selectedMainItems:", selectedMainItems);
        console.log("selectedAdditionalEntries:", selectedAdditionalEntries);
        // 選択された特定要素のMoleculeでエッジを作成する
        createSharedFlavorEdges([...selectedMainItems, ...selectedAdditionalEntries])
        const graph_result = extractLocalCoefficient([...selectedMainItems, ...selectedAdditionalEntries]);
        console.log(graph_result);

        /*const unique_eq = graph_result.reduce((new_array:DataNode[], { e1:Entry, e2:Entry}) => {
          const existingEntry = new_array.find(item => item.name === e1.name);
        
          if (existingEntry) {
            // 存在する場合、e2.nameをimportsに追加
            existingEntry.imports.push(e2.name);
          } else {
            // 存在しない場合、新たにエントリを作成
            new_array.push({
              name: e1.name,
              size: 12, // 固定のサイズ
              imports: [e2.name]
            });
          }
        
          return new_array;
        }, []);

        setCoefficientData(unique_eq);
        */

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  }, [selectedMainGroup, selectedMainItems, selectedAdditionalEntries]); 

  // ダミーデータ
  const dummy_data = [
    {
        "name": "company.salesManager.salesPersonA",
        "size": 12,
        "imports": [
            "company.salesManager.salesPersonB",
            "company.HRManager.recruiterB",
            "company.engineerManager.engineerB"
        ]
    },
    {
        "name": "company.salesManager.salesPersonB",
        "size": 2,
        "imports": []
    },
    {
        "name": "company.HRManager.recruiterA",
        "size": 120,
        "imports": [
            "company.HRManager.recruiterB",
            "company.salesManager.salesPersonA"
        ]
    },
    {
        "name": "company.HRManager.recruiterB",
        "size": 19,
        "imports": []
    },
    {
        "name": "company.engineerManager.engineerA",
        "size": 121,
        "imports": []
    },
    {
        "name": "company.engineerManager.engineerB",
        "size": 127,
        "imports": [
            "company.engineerManager.engineerA"
        ]
    }
  ];
  
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
      <NetworkGraph data={dummy_data} />
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

