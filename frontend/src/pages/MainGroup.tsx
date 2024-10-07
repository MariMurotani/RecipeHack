import React from 'react';  // React をインポート
import { useAppContext } from '../AppContext'; 
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// import { getEntryDataWithCategoryGroup } from '../api/neo4j';
//wait getEntryDataWithCategoryGroup();

const MainGroup: React.FC = () => {
  const { selectedMainGroup, setSelectedMainGroup } = useAppContext();  
  const navigate = useNavigate()
  console.log(selectedMainGroup)

  if(selectedMainGroup == null){
    navigate('/')
  }
  return (
      <Container>
        <Typography variant="h4" gutterBottom>
        Please choose the main ingredient
        </Typography>
      </Container>
  );
};

export default MainGroup;
