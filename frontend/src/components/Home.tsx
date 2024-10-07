import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Home Page
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to the Home page! Enjoy your stay.
      </Typography>
      <Button variant="contained" color="primary">
        Learn More
      </Button>
    </Container>
  );
};

export default Home;
