import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Button, Box, Tab, Tabs, CircularProgress, Divider, Link } from '@mui/material';
import { useAppContext } from '../AppContext';
import NetworkGraph, { DataNode } from '../components/NetworkGraph';
import Heatmap from "../components/Heatmap";
import GraphTooltip from '../components/GraphTooltip';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { extractLocalCoefficient, fetchAromaCompoundWithEntries, fetchAromaCompoundWithEntry } from '../api/neo4j';
import { AromaCompound, Coefficient, Entry } from 'src/api/types';
import { HeatmapData } from '../hooks/useHeatMap';
import ReactMarkdown from "react-markdown";
import MySunburstChart, { sampleSunburstData } from '../components/SunburstChart';
import MyChordChart, { sampleChordData, sampleChordKeys } from '../components/ChrodChart';
import MySankeyChart, { sankeySampleData } from '../components/SankeyChart';
import { useGPTGeneration }  from '../hooks/useGPTGeneration';

const Constitution: React.FC = () => {
  // 共通のデータストアとして、クリックされたボタンのキーを保存するための状態を管理
  const { selectedMainGroup, selectedMainItems, selectedGroups, selectedAdditionalEntries } = useAppContext();  
  // タブの状態を管理するためのuseState
  const [tabNumber, setTabNumber] = useState<string>('1');
  // ネットワークグラフ用のデータを保持
  const [coefficientData, setCoefficientData] = useState<DataNode[]>([]);
  // ヒートマップ用のデータを保持
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  // ツールチップ表示用のState
  const [showToolTip, setShowToolTip] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // GPT用のカスタムフックを使用
  const { gptSuggest, loading, processGPT } = useGPTGeneration(selectedMainItems, selectedAdditionalEntries);  
  // タブチェンジのハンドラ
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {     setTabNumber(newValue);   };

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
    processCoefficients();
    processAromaHeatmap();
  }, [selectedMainItems, selectedAdditionalEntries]); 
  
  useEffect(() => {
    if(tabNumber === '3') {
      console.log("GPT Process -- ");
      processGPT();
    }
  }, [tabNumber]);

  // Markdown 用のカスタムレンダラー
  const components = {
    h1: ({ node, ...props }: any) => <Typography variant="h4" gutterBottom {...props} />,
    h2: ({ node, ...props }: any) => <Typography variant="h5" gutterBottom {...props} />,
    h3: ({ node, ...props }: any) => <Typography variant="h6" gutterBottom {...props} />,
    p: ({ node, ...props }: any) => <Typography variant="body1" gutterBottom {...props} />,
    a: ({ node, ...props }: any) => <Link {...props} target="_blank" rel="noopener noreferrer" />,
    ul: ({ node, ...props }: any) => <Box component="ul" sx={{ pl: 4 }} {...props} />,
    ol: ({ node, ...props }: any) => <Box component="ol" sx={{ pl: 4 }} {...props} />,
    li: ({ node, ...props }: any) => <Typography component="li" variant="body1" {...props} />,
    hr: () => <Divider sx={{ my: 2 }} />
  };

  return (
    <Container>
        <TabContext value={tabNumber}>

          <Box sx={{ borderBottom: 0, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange} aria-label="lab API tabs example" sx={{ justifyContent: 'center' }}>
            <Tab label="Constitution Network" value="1" />
            <Tab label="Food Network" value="2" />
            <Tab label="HEAT MAP" value="3" />
            <Tab label="RECIPE GENERATION" value="4" />
            </TabList>
          </Box>
          {/* コンポネント表示 */}
          <TabPanel value="1" sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          </TabPanel>
          {/* 食材ネットワークを表示 */}
          <TabPanel value="2" sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {coefficientData.length > 0 && (<NetworkGraph data={coefficientData} hover_callback={toolTipNode}/>)}
          </TabPanel>
          {/* 食材ヒートマップ */}
          <TabPanel value="3" sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Heatmap data={heatmapData} width={500} height={500} />
          </TabPanel>
          {/* レシピ生成GPT */}
          <TabPanel value="4" sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box
            display="flex" flexDirection="column" alignItems="top" justifyContent="center"
            sx={{ marginTop: "20px" }}
            > 
            <ReactMarkdown components={components}>{gptSuggest}</ReactMarkdown>
            {(loading) && <Box display="flex" alignItems="center" justifyContent="center" margin="20px"><CircularProgress /></Box> }
            </Box>
          </TabPanel>
      </TabContext>
      <MyChordChart data={sampleChordData} keys={sampleChordKeys} />
      <MySunburstChart data={sampleSunburstData} />
      <MySankeyChart data={sankeySampleData}></MySankeyChart>
    </Container>
  );
};

export default Constitution;
