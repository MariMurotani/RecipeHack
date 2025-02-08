import React, { useState, useEffect } from 'react';  // React をインポート
import { useAppContext } from '../AppContext'; 
import { Container, Typography, TextField, Button, Checkbox, IconButton } from '@mui/material';
import { fetchPageRank } from '../api/neo4j';
import HeatmapBarChart, { BarChartData}  from '../components/HeatmapBarChart';
import { PageRankResult } from 'src/api/types';

const CentralityAnalytics: React.FC = () => {
    const [pageRankResult, setPageRankResult] = useState<PageRankResult[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
              const fetchedPageRankResult:PageRankResult[] = await fetchPageRank();
              setPageRankResult(fetchedPageRankResult);
            } catch (error) {
              console.error("Error fetching PageRank:", error);
            }
          };
      
          fetchData(); // 非同期関数を実行
    }, []);

    return (
        <Container>
          
          <ul>
            {
                pageRankResult.map((pageRank, index) => (
                  <li key={index}>{pageRank.foodName} {pageRank.displayNameJa}: {pageRank.avgScore} </li>
                ))
            }
          </ul>
        </Container>
    );
}

export default CentralityAnalytics;