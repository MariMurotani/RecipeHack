import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        404 - Not Found
      </Typography>
      <Typography variant="body1" paragraph>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" color="secondary" component={Link} to="/">
        Go Back to Home
      </Button>
    </Container>
  );
};

export default NotFound;
