import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Button, Box, Tab, Tabs, CircularProgress, Divider, Link } from '@mui/material';
import { useAppContext } from '../AppContext';
import Heatmap from "../components/Heatmap";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { extractLocalCoefficient, fetchAromaCompoundWithEntries } from '../api/neo4j';
import { AromaCompound, Coefficient, Entry } from 'src/api/types';
import { HeatmapData } from '../hooks/useHeatMap';
import ReactMarkdown from "react-markdown";
import MySunburstChart, { SunburstData, sampleSunburstData } from '../components/SunburstChart';
import MyChordChart, { ChordChartData, sampleChordData, sampleChordKeys } from '../components/ChrodChart';
import MySankeyChart, { SankeyChartData, SankeyNode, SankeyLink, sankeySampleData  } from '../components/SankeyChart';
import { useGPTGeneration }  from '../hooks/useGPTGeneration';
import { AromaLink } from '../api/types';
import { hexToHsl } from "../api/color_utils";
import { main } from 'src/api/open_ai';

const Constitution: React.FC = () => {
  // 共通のデータストアとして、クリックされたボタンのキーを保存するための状態を管理
  const { selectedMainGroup, selectedMainItems, selectedGroups, selectedAdditionalEntries } = useAppContext();  
  // タブの状態を管理するためのuseState
  const [tabNumber, setTabNumber] = useState<string>('1');
  // Sankeyチャート用のデータを保持
  const [sankeyData, setSankeyData] = useState<SankeyChartData>({ nodes: [], links: [] });
  // リンクとAromaNoteのマップを保持
  const [sankeyLinkAromaNotes, setSankeyLinkAromaNotes] = useState<AromaLink[]>([]);
  // チョードチャート用のデータを保持
  const [chordChartData, setShordChartData] = useState<ChordChartData>({keys:[], data: []});
  // サンバーストチャート用のデータを保持
  const [sunburstChartData, setSunburstChartData] = useState<SunburstData>({ id: "root", children: [] });
  // ヒートマップのデータを受け取る
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  // GPT用のカスタムフックを使用
  const { gptSuggest, loading, processGPT } = useGPTGeneration(selectedMainItems, selectedAdditionalEntries);  
  // タブチェンジのハンドラ
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {     setTabNumber(newValue);   };

  // 食材ペアの分析
  const processCoefficients = async () => {
    try {
        //  neo4j問い合わせ
        const graphCoefResult: Coefficient[] = await extractLocalCoefficient([...selectedMainItems, ...selectedAdditionalEntries]);
        console.log(JSON.stringify(graphCoefResult));

        // サンキーチャート用のデータ変換
        const { chartData: sankeyData, aromaLinks: linkAromaNotes } = transformToSankeyNodes(graphCoefResult);
        setSankeyData(sankeyData);
        setSankeyLinkAromaNotes(linkAromaNotes);

        // チョードグラフのデータ変換
        setShordChartData(transformToChordNodes(graphCoefResult));

        //  neo4j問い合わせ
        const entry_ids = [selectedMainItems, selectedAdditionalEntries].map(entries => entries.map(entry => entry.id)).flat();
        const aromaCompounds: AromaCompound[] = await fetchAromaCompoundWithEntries(entry_ids);
    
        // サンバーストチャートのデータ変換
        setSunburstChartData(transformToSunburst(aromaCompounds));
        console.log("sampleSunburstData -- ", sampleSunburstData);

        //　ヒートマップのデータ変換
        setHeatmapData(transformToAromaHeatmap(aromaCompounds));        ;

    } catch (error) {
        console.error("Error processing coefficients:", error);
    }
  };

  // チョードチャート用のデータに変換
  const transformToChordNodes = (graphCoefResult: Coefficient[]): ChordChartData => {
    const chordChartKeys = new Set<string>();
    graphCoefResult.forEach(({ e1, e2 }) => {
      chordChartKeys.add(e1.id);
      chordChartKeys.add(e2.id);
    });
    const chordChartMatrix = Array.from({ length: chordChartKeys.size }, () =>
        Array(chordChartKeys.size).fill(0)
    );
    graphCoefResult.forEach(({e1, e2}) => {
        const e1Index = Array.from(chordChartKeys).indexOf(e1.id);
        const e2Index = Array.from(chordChartKeys).indexOf(e2.id);
        chordChartMatrix[e1Index][e2Index] += 1;
    });
    return { keys: Array.from(chordChartKeys), data: chordChartMatrix }
  };

  // サンバースト用のデータに変換
  function transformToSunburst(aromaCompounds: AromaCompound[]): SunburstData {
    const root: SunburstData = {  id: "root", color: "hsl(77, 70%, 50%)", children: [] };
  
    aromaCompounds.forEach((ac:AromaCompound) => {
      const category_id = ac.category
      let categoryNode = root.children?.find((node) => node.id === category_id);
      if (!categoryNode) {
        categoryNode = { id: category_id, children: [], value: 1, customLabel: ac.category };
        root.children?.push(categoryNode);
      }
  
    const sub_category_id = `${ac.category}-${ac.sub_category}`;
      let subCategoryNode = categoryNode.children?.find((node) => node.id === sub_category_id);
      if (!subCategoryNode) {
        subCategoryNode = { id: sub_category_id, children: [], value: 1, customLabel: ac.sub_category};
        categoryNode.children?.push(subCategoryNode);
      }
  
      const entry_id = `${sub_category_id}-${ac.entry_id}`;
      let entryNode = subCategoryNode.children?.find((node) => node.id === entry_id);
      if (!entryNode) {
        entryNode = { id: `${entry_id}`, children: [], value: 1, customLabel: ac.entry_name_ja};
        subCategoryNode.children?.push(entryNode);
      }

      const aroma_id = `${entry_id}-${ac.aroma_id}`;
      let aromaNode = entryNode.children?.find((node) => node.id === aroma_id);
      if (!aromaNode) {
        aromaNode = { id: `${aroma_id}`, children: [], value: 1, customLabel: ac.aroma_id, customColor: ac.color };
        entryNode.children?.push(aromaNode);
      }
    });

    return root;
  }

  // サンキーチャート用のデータに変換
  const transformToSankeyNodes = (graphCoefResult: Coefficient[]): { chartData: SankeyChartData, aromaLinks: AromaLink[] } => {
      // ノードのセット（重複防止）
      const nodes: SankeyNode[] = [];

      // リンクをマップで管理
      const linkMap = new Map<string, number>();
      const linkAromaNotes = new Map<string, Map<string, number>>();

      graphCoefResult.forEach(({ e1, e2, ratio, aroma }) => {
          const ratioValue = Math.round((Number(ratio) || 0) * 10000) / 10000;

          // ノードをセットに追加
          if (!nodes.some(n => n.id === e1.id)) {
              nodes.push({ id: e1.id, nodeColor: `hsl(${Math.random() * 360}, 70%, 50%)` });
          }
          
          if (!nodes.some(n => n.id === e2.id)) {
              nodes.push({ id: e2.id, nodeColor: `hsl(${Math.random() * 360}, 70%, 50%)` });
          }

          // リンクの値を累積
          const linkKey = `${e1.id}-${e2.id}`;        
          linkMap.set(linkKey, (linkMap.get(linkKey) || 0) + ratioValue);
          
          const aromaMap = linkAromaNotes.get(linkKey) ?? new Map<string, number>();
          aromaMap.set(aroma, (aromaMap.get(aroma) || 0) + ratioValue);
          linkAromaNotes.set(linkKey, aromaMap);
      });

      // マップから配列へ変換
      const links: SankeyLink[] = Array.from(linkMap, ([key, value]) => {
          const [source, target] = key.split("-");
          return { source, target, value };
      });

      // AromaLink の配列に変換
      const aromaLinks: AromaLink[] = Array.from(linkAromaNotes, ([key, aromaNotes]) => {
          return { link_id: key, aromaNotes };
      });

      return { chartData: { nodes, links }, aromaLinks };
  };
  
  // 各食材のAromaCompoundを取得
  const transformToAromaHeatmap = (aromaCompounds: AromaCompound[]): HeatmapData[] => {
      const heatmapData:HeatmapData[] = [];
      aromaCompounds.forEach((aroma) => {
        if (aroma.average_ratio > 10) {
          heatmapData.push({ group: aroma.entry_name, variable: aroma.aroma_id, value: aroma.average_ratio, colorCode: aroma.color });
        }
      });
      return heatmapData;
  };
  
  useEffect(() => {
    processCoefficients();
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
          {/* 食材ネットワーク */}
          <TabPanel value="1" sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <MyChordChart {...chordChartData} />
          </TabPanel>
          {/* ネットワークの詳細を表示 */}
          <TabPanel value="2" sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            { sankeyData?.nodes?.length > 0 && sankeyData?.links?.length > 0 && <MySankeyChart data={sankeyData} linkAromaNotes={sankeyLinkAromaNotes}/> }
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
      <MySunburstChart data={sunburstChartData} />
  </Container>
  );
};

export default Constitution;
