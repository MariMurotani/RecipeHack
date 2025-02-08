import React, { useState, useEffect, useMemo } from 'react';  // React をインポート
import { useAppContext } from '../AppContext'; 
import { Container, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { fetchPageRank } from '../api/neo4j';
import { PageRankResult } from 'src/api/types';
import { FOOD_CATEGORIES } from '../api/constants';

const CentralityAnalytics: React.FC = () => {
    const [pageRankResult, setPageRankResult] = useState<PageRankResult[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['']);
    const stableSelectedCategories = useMemo(() => selectedCategories, [selectedCategories]);

    const handleChange = (event: SelectChangeEvent<typeof selectedCategories>) => {
      const value = event.target.value;
      const selectedValues = typeof value === 'string' ? [value] : value
      setSelectedCategories(selectedValues.filter((v) => v !== ''));
    };  

    useEffect(() => {
        const fetchData = async () => {
            try {
              const fetchedPageRankResult:PageRankResult[] = await fetchPageRank(selectedCategories);
              console.log(fetchedPageRankResult);
              setPageRankResult(fetchedPageRankResult);
            } catch (error) {
              console.error("Error fetching PageRank:", error);
            }
          };
      
          fetchData();
    }, [stableSelectedCategories]);

    return (
        <Container>
           <Select
                labelId="food-category-label"
                multiple
                value={selectedCategories}
                onChange={handleChange}
                displayEmpty
                sx={{ width: 200 }}
            >
                    {FOOD_CATEGORIES.map((category) => (
                    <MenuItem key={category.key} value={category.key}>
                        {category.label}
                    </MenuItem>
                ))}
            </Select>
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