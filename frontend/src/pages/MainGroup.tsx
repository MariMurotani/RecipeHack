import React from 'react';  // React をインポート
import { useAppContext } from '../AppContext'; 
import { Container, Typography, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getEntryDataWithCategoryGroup } from '../api/neo4j';

const MainGroup: React.FC = () => {
  const { selectedMainGroup, setSelectedMainGroup } = useAppContext();  
  const navigate = useNavigate()
  console.log(selectedMainGroup)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const text = event.target.value;
    getEntryDataWithCategoryGroup(selectedMainGroup, event.target.value);

  };
  
  getEntryDataWithCategoryGroup(selectedMainGroup, "");

  if(selectedMainGroup == null){
    navigate('/')
  }
  return (
      <Container>
        <Typography variant="h4" gutterBottom>
        Please choose the main ingredient
        </Typography>
        {/* テキストボックスを配置 */}
        <TextField
          label="Find main ingredient"
          onChange={handleChange}  // 値が変更されるたびに handleChange が呼ばれる
          fullWidth
          variant="outlined"
        />
      </Container>
  );
};

export default MainGroup;
