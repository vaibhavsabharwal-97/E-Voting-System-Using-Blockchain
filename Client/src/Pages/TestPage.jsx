import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const TestPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Test Page Works!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          If you can see this, routing is working correctly.
        </Typography>
        <Button 
          component={Link}
          to="/"
          variant="contained"
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default TestPage; 