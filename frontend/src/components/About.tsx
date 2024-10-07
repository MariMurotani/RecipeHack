import React from 'react';
import { Container, Typography } from '@mui/material';

const About: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        About Us
      </Typography>
      <Typography variant="body1" paragraph>
        This is the About page. We are happy to share more information about our project.
      </Typography>
    </Container>
  );
};

export default About;
