import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Button, Box, Tab, Tabs, CircularProgress, Divider } from '@mui/material';
import { useAppContext } from '../AppContext';
import NetworkGraph, { DataNode } from '../components/NetworkGraph';
import Heatmap from "../components/Heatmap";
import GraphTooltip from '../components/GraphTooltip';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { extractLocalCoefficient, fetchAromaCompoundWithEntries, fetchAromaCompoundWithEntry } from '../api/neo4j';
import { askChatGPT } from '../api/open_ai';
import { fetchOllamaResponse } from '../api/ollama';
import { AromaCompound, Coefficient, Entry } from 'src/api/types';
import { HeatmapData } from '../hooks/useHeatMap';

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
  // ヒートマップ用のデータを保持
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  // ツールチップ表示用のState
  const [showToolTip, setShowToolTip] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // タブチェンジのハンドラ
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {     setTabNumber(newValue);   };

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

  // Ollamaへお伺い
  const processOllama = async () => {
    if (selectedMainItems.length === 0 || selectedAdditionalEntries.length === 0) {
      return;
    }
    const question = `This is the test request for ollama. `;
    const response = await fetchOllamaResponse(question);
    setGptSuggest(response ?? "");
    setLoading(true);
  };

  // 食材ペアの分析
  const processCoefficients = async () => {
    try {
      const graphCoefResult: Coefficient[] = await extractLocalCoefficient([...selectedMainItems, ...selectedAdditionalEntries]);

      let graphNetData: DataNode[] = [];
      
      const updateGraphData = (node: Entry, connectedNode: Entry, aroma: string, ratio: number) => {
        let existingEntry = graphNetData.find(item => item.id === node.id);
        if (existingEntry) {
          existingEntry.size += ratio;
          existingEntry.imports.push(connectedNode.name);
          existingEntry.edge_titles.push(aroma);
        } else {
          graphNetData.push({
            id: node.id,
            name: node.name,
            edge_titles: [aroma],
            size: ratio,
            imports: [connectedNode.name],
          });
        }
      };

      graphCoefResult.forEach(({ e1, e2, count, aroma, ratio }) => {
        const ratioValue = Number(ratio);
        updateGraphData(e1, e2, aroma, ratioValue);
        updateGraphData(e2, e1, aroma, ratioValue);
      });
      setCoefficientData([...graphNetData]);
    } catch (error) {
      console.error("Error processing coefficients:", error);
    }
  };
  
  // 各食材のAromaCompoundを取得
  const processAromaHeatmap = async () => {
      const entry_ids = [selectedMainItems, selectedAdditionalEntries].map(entries => entries.map(entry => entry.id)).flat();
      const aromaCompounds: AromaCompound[] = await fetchAromaCompoundWithEntries(entry_ids);
      const heatmapData:HeatmapData[] = [];
      aromaCompounds.forEach((aroma) => {
        if (aroma.average_ratio > 10) {
          heatmapData.push({ group: aroma.entry_name, variable: aroma.aroma_id, value: aroma.average_ratio, colorCode: aroma.color });
        }
      });
      setHeatmapData(heatmapData);
  };
  
  // グラフのツールチップ表示
  const toolTipNode = (e: MouseEvent, entry_id: string, show: boolean) => {
    setShowToolTip(show);
    setMousePosition({ x: e.clientX, y: e.clientY });
    setShowToolTip(show);
  };
  
  useEffect(() => {
    //processGPT();
    processOllama();
    processCoefficients();
    processAromaHeatmap();
  }, [selectedMainItems, selectedAdditionalEntries]); 
  
  return (
    <Container>
        <TabContext value={tabNumber}>

        <Box sx={{ borderBottom: 0, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="lab API tabs example" sx={{ justifyContent: 'center' }}>
          <Tab label="Food Network" value="1" />
          <Tab label="HEAT MAP" value="2" />
          </TabList>
        </Box>
        {/* 食材ネットワークを表示 */}
        <TabPanel value="1" sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {coefficientData.length > 0 && (<NetworkGraph data={coefficientData} hover_callback={toolTipNode}/>)}
        </TabPanel>
        {/* 食材ヒートマップ */}
        <TabPanel value="2" sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Heatmap data={heatmapData} width={500} height={500} />
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
