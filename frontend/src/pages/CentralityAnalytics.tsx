import React, { useState, useEffect } from 'react';  // React をインポート
import { useAppContext } from '../AppContext'; 
import { Container, Typography, TextField, Button, Checkbox, IconButton } from '@mui/material';
import { fetchPageRank } from '../api/neo4j';
import HeatmapBarChart, { BarChartData}  from '../components/HeatmapBarChart';

const CentralityAnalytics: React.FC = () => {

    useEffect(() => {
        const fetchData = async () => {
            try {
              const pageRankResult = await fetchPageRank(); // 非同期関数を待機
              console.log(pageRankResult);
            } catch (error) {
              console.error("Error fetching PageRank:", error);
            }
          };
      
          fetchData(); // 非同期関数を実行
    }, []);

    const data:BarChartData[] = [
        { label: 'A', value: 10 },
        { label: 'B', value: 25 },
        { label: 'C', value: 15 },
        { label: 'D', value: 30 },
    ];

    return (
        <Container>
            <Typography variant="h2">Centrality Analytics</Typography>
            <HeatmapBarChart data={data} />
        </Container>
    );
}

export default CentralityAnalytics;