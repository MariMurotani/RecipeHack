import React, { useEffect, useRef } from 'react';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import DoubleCircularBarPlot, { FlavorPairDataType } from '../components/DoubleCircularBarPlot';
import { normalizeDistances } from 'src/api/neo4j';

const Constitution: React.FC = () => {
  // 共通のデータストアとして、クリックされたボタンのキーを保存するための状態を管理
  const { selectedMainGroup, selectedMainItems, selectedGroups, selectedAdditionalEntries } = useAppContext();  

  const svgRef = useRef<SVGSVGElement | null>(null);
  selectedMainItems

  //createSharedFlavorEdges([...selectedMainItems, ...selectedAdditionalEntries])

  const paringScore: { [key: string]: number } = {};
  const flavorCount: { [key: string]: number } = {};
  [...selectedMainItems, ...selectedAdditionalEntries].forEach((item) => {
    Object.keys(item.paring_scores).forEach((key: string) => {
      const v1 = item.paring_scores[key];
      const v2 = item.flavor_count[key];
      if(Object.keys(paringScore).includes(key) && key.length > 0){
        paringScore[key] += v1*100;
        flavorCount[key] += v2*100;
      }else{
        paringScore[key] = v1*1000;
        flavorCount[key] = v2*1000;
      }
    });
  });

// オブジェクトのソートと上位n件を取得する関数
const sortAndSliceTopN = (obj: { [key: string]: number }, n: number) => {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
};
const maxScale = (data: [string, number][]): [string, number][] => {
  const maxValue = Math.max(...data.map(item => item[1]));

  // 最大値が0でないことを確認してから正規化
  if (maxValue === 0) return data;

  return data.map(([key, value]) => [key, parseFloat((value / maxValue).toFixed(2))]);
};

// paringScore と flavorCount の処理を関数化
let sortedParingScore = sortAndSliceTopN(paringScore, 15);
let sortedFlavorCount = sortAndSliceTopN(flavorCount, 15);
let normalizedParingScore = maxScale(sortedParingScore);
let normalizedFlavorCount = maxScale(sortedFlavorCount);

console.log(normalizedParingScore);
console.log(normalizedFlavorCount);

const graphData: FlavorPairDataType[] = sortedParingScore.map((item, index) => {
    return {
      Flavor: item[0], // FlavorはsortedParingScoreのキー（文字列）
      v1: item[1],     // v1はsortedParingScoreの値（数値）
      v2: sortedFlavorCount[index][1] // v2はsortedFlavorCountから対応する数値
    };
  });

  return (
    <Container>
      <Typography variant="h4"></Typography>
      <Box
        justifyContent="center"
        sx={{
          display: 'flex',
          gap: 1, // ラベル間のスペース
          flexWrap: 'wrap', // ラベルが画面サイズに応じて折り返される
          mt: 4 // マージン
        }}>
        <DoubleCircularBarPlot data={graphData} />
      </Box>
    </Container>
  );
};

export default Constitution;

