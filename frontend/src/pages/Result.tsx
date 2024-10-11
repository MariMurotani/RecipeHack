import React, { useEffect, useRef } from 'react';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import * as d3 from 'd3';

const Home: React.FC = () => {
  // 共通のデータストアとして、クリックされたボタンのキーを保存するための状態を管理
  const { selectedMainGroup, selectedMainItems, selectedGroups, selectedAdditionalEntries } = useAppContext();  

  console.log(selectedMainItems);
  console.log(selectedAdditionalEntries);

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // SVG要素の参照を取得
    const svg = d3.select(svgRef.current)
      .attr('width', 400)
      .attr('height', 400)
      .style('background-color', '#f0f0f0');

    // 円を描画
    svg.append('circle')
      .attr('cx', 200)  // X座標
      .attr('cy', 200)  // Y座標
      .attr('r', 50)    // 半径
      .attr('fill', 'blue');  // 色
  }, []);

  return (
    <Container>
      <Typography variant="h4">
      Analysys
      </Typography>
      <svg ref={svgRef}></svg>
    </Container>
  );
};

export default Home;
