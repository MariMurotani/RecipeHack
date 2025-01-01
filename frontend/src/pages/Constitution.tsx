import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Button, Box, Tab, Tabs, CircularProgress, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import DoubleCircularBarPlot, { FlavorPairDataType } from '../components/DoubleCircularBarPlot';
import NetworkGraph, { DataNode } from '../components/NetworkGraph';
import { calculateScores, sortAndSliceTopN, maxScale } from '../api/calcFunction';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { extractLocalCoefficient } from '../api/neo4j';
import { askChatGPT } from '../api/open_ai';
import { Coefficient } from 'src/api/types';

const Constitution: React.FC = () => {
  // 共通のデータストアとして、クリックされたボタンのキーを保存するための状態を管理
  const { selectedMainGroup, selectedMainItems, selectedGroups, selectedAdditionalEntries } = useAppContext();  
  // タブの状態を管理するためのuseState
  const [tabNumber, setTabNumber] = useState<string>('1');
  // GPTの結果用
  const [gptSuggest, setGptSuggest] = useState<string>('');
  // ローディング用
  const [loading, setLoading] = useState<boolean>(false);
  // ネットワークグラフ用のデータを保持
  const [coefficientData, setCoefficientData] = useState<DataNode[]>([]);
  // 円バーグラフ用のデータを保持
  const [doubleBarData, setDoubleBarData] = useState<FlavorPairDataType[]>([]);
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabNumber(newValue);
  };

  // GTPへお伺い
  const processGPT = async () => {
    if (selectedMainItems.length === 0 || selectedAdditionalEntries.length === 0) {
      return;
    }
    const nameList = [...selectedMainItems, ...selectedAdditionalEntries].map(entry => entry.name).join(', ');
    const messages = [
      { role: 'system', content: 'You are a one of the great chef in the world.' },
      { role: 'user', content: `What do you cook with ${nameList}? tell me title of dish, ingredient and steps.` }
    ];
    askChatGPT(messages).then(answer => {
      setGptSuggest(answer);
      setLoading(true);
    }).catch(error => {
      console.error('エラー:', error);
    });
  };

  // 食材ペアの分析
  const processCoefficients = async () => {
  try {
    const graphCoefResult: Coefficient[] = await extractLocalCoefficient([...selectedMainItems, ...selectedAdditionalEntries]);

    let graphNetData: DataNode[] = [];

    const updateGraphData = (nodeName: string, connectedNode: string, aroma: string, ratio: number) => {
      let existingEntry = graphNetData.find(item => item.name === nodeName);

      if (existingEntry) {
        existingEntry.size += ratio;
        existingEntry.imports.push(connectedNode);
        existingEntry.edge_titles.push(aroma);
      } else {
        graphNetData.push({
          id: nodeName,
          name: nodeName,
          edge_titles: [aroma],
          size: ratio,
          imports: [connectedNode],
        });
      }
    };

    graphCoefResult.forEach(({ e1, e2, count, aroma, ratio }) => {
      const ratioValue = Number(ratio);

      updateGraphData(e1.name, e2.name, aroma, ratioValue);
      updateGraphData(e2.name, e1.name, aroma, ratioValue);
    });
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

  // グラフのツールチップ表示
  const toolTipNode = (e: MouseEvent) => {
    console.log(e);
  };
  
  useEffect(() => {
    //processGPT();
    processCoefficients();
    //processFlavorParing();
  }, [selectedMainItems, selectedAdditionalEntries]); 
    
  return (
    <Container>
        <TabContext value={tabNumber}>
        <Box sx={{ borderBottom: 0, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="lab API tabs example" sx={{ justifyContent: 'center' }}>
          <Tab label="Food Network" value="1" />
          <Tab label="Pairing Idea" value="2" />
          </TabList>
        </Box>
        {/* TabPanelの横幅を100%、コンテンツをセンタリング */}
        <TabPanel value="1" sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {coefficientData.length > 0 && (<NetworkGraph data={coefficientData} hover_callback={toolTipNode}/>)}
        </TabPanel>
        <TabPanel value="2" sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <DoubleCircularBarPlot data={doubleBarData} />
        </TabPanel>
      </TabContext>
      <Divider />
      <Box
         display="flex" flexDirection="column" alignItems="top" justifyContent="center"
        >
        {(!loading) ? (
                // ローディング中はCircularProgressを表示
                <Box display="flex" alignItems="center" justifyContent="center" margin="20px"><CircularProgress /></Box>
            ) : (
                // ローディング完了後はテキストを表示
                <Typography variant="body1" mt={2} sx={{ whiteSpace: 'pre-line' }}>
                    {gptSuggest}
                </Typography>
            )}
        </Box>
    </Container>
  );
};

export default Constitution;
