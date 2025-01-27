import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Button, Box, Tab, Tabs, CircularProgress, Divider, Link } from '@mui/material';
import { useAppContext } from '../AppContext';
import NetworkGraph, { DataNode } from '../components/NetworkGraph';
import Heatmap from "../components/Heatmap";
import GraphTooltip from '../components/GraphTooltip';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { extractLocalCoefficient, fetchAromaCompoundWithEntries, fetchAromaCompoundWithEntry } from '../api/neo4j';
import { generateAllRecipe } from '../api/open_ai_chef';
import { AromaCompound, Coefficient, Entry } from 'src/api/types';
import { HeatmapData } from '../hooks/useHeatMap';
import ReactMarkdown from "react-markdown";
import MyResponsiveSunburst, { SunburstData } from '../components/SunburstChart';

const Constitution: React.FC = () => {
  // 共通のデータストアとして、クリックされたボタンのキーを保存するための状態を管理
  const { selectedMainGroup, selectedMainItems, selectedGroups, selectedAdditionalEntries } = useAppContext();  
  // タブの状態を管理するためのuseState
  const [tabNumber, setTabNumber] = useState<string>('1');
  // GPTの結果用
  const [gptSuggest, setGptSuggest] = useState<string>('');
  // ローディング用
  const [loading, setLoading] = useState<boolean>(true);
  // ネットワークグラフ用のデータを保持
  const [coefficientData, setCoefficientData] = useState<DataNode[]>([]);
  // ヒートマップ用のデータを保持
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  // ツールチップ表示用のState
  const [showToolTip, setShowToolTip] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // タブチェンジのハンドラ
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {     setTabNumber(newValue);   };

  // Ollamaへお伺い
  const processGPT = async () => {
    if (selectedMainItems.length === 0 || selectedAdditionalEntries.length === 0) {
        return;
    }
    setLoading(true);
    setGptSuggest(''); // 初期化
   
    const ingiriList:string[] = [...selectedMainItems, ...selectedAdditionalEntries].map(entry => entry.name);
    await generateAllRecipe(ingiriList, (partial) => {
      setGptSuggest(prev => prev + partial);
    });

    setLoading(false);
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

  const sampleData: SunburstData = {
    "id": "nivo",
    "color": "hsl(77, 70%, 50%)",
    "children": [
      {
        "id": "viz",
        "color": "hsl(177, 70%, 50%)",
        "children": [
          {
            "id": "stack",
            "color": "hsl(120, 70%, 50%)",
            "children": [
              {
                "id": "cchart",
                "color": "hsl(227, 70%, 50%)",
                "value": 28971
              },
              {
                "id": "xAxis",
                "color": "hsl(283, 70%, 50%)",
                "value": 25280
              },
              {
                "id": "yAxis",
                "color": "hsl(17, 70%, 50%)",
                "value": 6725
              },
              {
                "id": "layers",
                "color": "hsl(199, 70%, 50%)",
                "value": 126438
              }
            ]
          },
          {
            "id": "ppie",
            "color": "hsl(272, 70%, 50%)",
            "children": [
              {
                "id": "chart",
                "color": "hsl(286, 70%, 50%)",
                "children": [
                  {
                    "id": "pie",
                    "color": "hsl(320, 70%, 50%)",
                    "children": [
                      {
                        "id": "outline",
                        "color": "hsl(310, 70%, 50%)",
                        "value": 149336
                      },
                      {
                        "id": "slices",
                        "color": "hsl(57, 70%, 50%)",
                        "value": 130293
                      },
                      {
                        "id": "bbox",
                        "color": "hsl(27, 70%, 50%)",
                        "value": 64017
                      }
                    ]
                  },
                  {
                    "id": "donut",
                    "color": "hsl(97, 70%, 50%)",
                    "value": 127215
                  },
                  {
                    "id": "gauge",
                    "color": "hsl(48, 70%, 50%)",
                    "value": 50475
                  }
                ]
              },
              {
                "id": "legends",
                "color": "hsl(48, 70%, 50%)",
                "value": 176680
              }
            ]
          }
        ]
      },
      {
        "id": "colors",
        "color": "hsl(348, 70%, 50%)",
        "children": [
          {
            "id": "rgb",
            "color": "hsl(241, 70%, 50%)",
            "value": 157700
          },
          {
            "id": "hsl",
            "color": "hsl(280, 70%, 50%)",
            "value": 77750
          }
        ]
      },
      {
        "id": "utils",
        "color": "hsl(333, 70%, 50%)",
        "children": [
          {
            "id": "randomize",
            "color": "hsl(221, 70%, 50%)",
            "value": 30375
          },
          {
            "id": "resetCvaluek",
            "color": "hsl(198, 70%, 50%)",
            "value": 102048
          },
          {
            "id": "noop",
            "color": "hsl(148, 70%, 50%)",
            "value": 32857
          },
          {
            "id": "tick",
            "color": "hsl(198, 70%, 50%)",
            "value": 160306
          },
          {
            "id": "forceGC",
            "color": "hsl(83, 70%, 50%)",
            "value": 32379
          },
          {
            "id": "stackTrace",
            "color": "hsl(152, 70%, 50%)",
            "value": 18597
          },
          {
            "id": "dbg",
            "color": "hsl(269, 70%, 50%)",
            "value": 121745
          }
        ]
      },
      {
        "id": "generators",
        "color": "hsl(92, 70%, 50%)",
        "children": [
          {
            "id": "address",
            "color": "hsl(212, 70%, 50%)",
            "value": 107803
          },
          {
            "id": "city",
            "color": "hsl(262, 70%, 50%)",
            "value": 188149
          },
          {
            "id": "animal",
            "color": "hsl(256, 70%, 50%)",
            "value": 84369
          },
          {
            "id": "movie",
            "color": "hsl(164, 70%, 50%)",
            "value": 163378
          },
          {
            "id": "user",
            "color": "hsl(189, 70%, 50%)",
            "value": 43838
          }
        ]
      },
      {
        "id": "set",
        "color": "hsl(308, 70%, 50%)",
        "children": [
          {
            "id": "clone",
            "color": "hsl(106, 70%, 50%)",
            "value": 152743
          },
          {
            "id": "intersect",
            "color": "hsl(291, 70%, 50%)",
            "value": 173451
          },
          {
            "id": "merge",
            "color": "hsl(174, 70%, 50%)",
            "value": 55686
          },
          {
            "id": "reverse",
            "color": "hsl(274, 70%, 50%)",
            "value": 17473
          },
          {
            "id": "toArray",
            "color": "hsl(188, 70%, 50%)",
            "value": 52337
          },
          {
            "id": "toObject",
            "color": "hsl(295, 70%, 50%)",
            "value": 199183
          },
          {
            "id": "fromCSV",
            "color": "hsl(45, 70%, 50%)",
            "value": 137164
          },
          {
            "id": "slice",
            "color": "hsl(39, 70%, 50%)",
            "value": 99719
          },
          {
            "id": "append",
            "color": "hsl(109, 70%, 50%)",
            "value": 92472
          },
          {
            "id": "prepend",
            "color": "hsl(106, 70%, 50%)",
            "value": 187225
          },
          {
            "id": "shuffle",
            "color": "hsl(124, 70%, 50%)",
            "value": 25792
          },
          {
            "id": "pick",
            "color": "hsl(86, 70%, 50%)",
            "value": 71446
          },
          {
            "id": "plouc",
            "color": "hsl(66, 70%, 50%)",
            "value": 60384
          }
        ]
      },
      {
        "id": "text",
        "color": "hsl(241, 70%, 50%)",
        "children": [
          {
            "id": "trim",
            "color": "hsl(269, 70%, 50%)",
            "value": 114314
          },
          {
            "id": "slugify",
            "color": "hsl(302, 70%, 50%)",
            "value": 175106
          },
          {
            "id": "snakeCase",
            "color": "hsl(278, 70%, 50%)",
            "value": 137744
          },
          {
            "id": "camelCase",
            "color": "hsl(250, 70%, 50%)",
            "value": 117944
          },
          {
            "id": "repeat",
            "color": "hsl(247, 70%, 50%)",
            "value": 120511
          },
          {
            "id": "padLeft",
            "color": "hsl(220, 70%, 50%)",
            "value": 57505
          },
          {
            "id": "padRight",
            "color": "hsl(271, 70%, 50%)",
            "value": 47409
          },
          {
            "id": "sanitize",
            "color": "hsl(226, 70%, 50%)",
            "value": 121149
          },
          {
            "id": "ploucify",
            "color": "hsl(170, 70%, 50%)",
            "value": 177185
          }
        ]
      },
      {
        "id": "misc",
        "color": "hsl(260, 70%, 50%)",
        "children": [
          {
            "id": "greetings",
            "color": "hsl(70, 70%, 50%)",
            "children": [
              {
                "id": "hey",
                "color": "hsl(291, 70%, 50%)",
                "value": 118615
              },
              {
                "id": "HOWDY",
                "color": "hsl(37, 70%, 50%)",
                "value": 193765
              },
              {
                "id": "aloha",
                "color": "hsl(68, 70%, 50%)",
                "value": 178771
              },
              {
                "id": "AHOY",
                "color": "hsl(98, 70%, 50%)",
                "value": 146734
              }
            ]
          },
          {
            "id": "other",
            "color": "hsl(14, 70%, 50%)",
            "value": 38750
          },
          {
            "id": "path",
            "color": "hsl(264, 70%, 50%)",
            "children": [
              {
                "id": "pathA",
                "color": "hsl(254, 70%, 50%)",
                "value": 120605
              },
              {
                "id": "pathB",
                "color": "hsl(68, 70%, 50%)",
                "children": [
                  {
                    "id": "pathB1",
                    "color": "hsl(224, 70%, 50%)",
                    "value": 73351
                  },
                  {
                    "id": "pathB2",
                    "color": "hsl(92, 70%, 50%)",
                    "value": 65811
                  },
                  {
                    "id": "pathB3",
                    "color": "hsl(127, 70%, 50%)",
                    "value": 35416
                  },
                  {
                    "id": "pathB4",
                    "color": "hsl(88, 70%, 50%)",
                    "value": 119251
                  }
                ]
              },
              {
                "id": "pathC",
                "color": "hsl(45, 70%, 50%)",
                "children": [
                  {
                    "id": "pathC1",
                    "color": "hsl(303, 70%, 50%)",
                    "value": 16246
                  },
                  {
                    "id": "pathC2",
                    "color": "hsl(72, 70%, 50%)",
                    "value": 80736
                  },
                  {
                    "id": "pathC3",
                    "color": "hsl(222, 70%, 50%)",
                    "value": 169994
                  },
                  {
                    "id": "pathC4",
                    "color": "hsl(191, 70%, 50%)",
                    "value": 56900
                  },
                  {
                    "id": "pathC5",
                    "color": "hsl(40, 70%, 50%)",
                    "value": 166372
                  },
                  {
                    "id": "pathC6",
                    "color": "hsl(282, 70%, 50%)",
                    "value": 47228
                  },
                  {
                    "id": "pathC7",
                    "color": "hsl(2, 70%, 50%)",
                    "value": 7696
                  },
                  {
                    "id": "pathC8",
                    "color": "hsl(245, 70%, 50%)",
                    "value": 103874
                  },
                  {
                    "id": "pathC9",
                    "color": "hsl(233, 70%, 50%)",
                    "value": 16924
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
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
      <MyResponsiveSunburst data={sampleData} />

    </Container>
  );
};

export default Constitution;
