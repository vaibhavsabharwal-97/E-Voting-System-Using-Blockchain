import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const IndianGovHeader = ({ title, subtitle, showFullHeader = true }) => {
  // Indian flag colors
  const saffron = '#FF9933';
  const white = '#FFFFFF';
  const green = '#138808';
  const navy = '#000080';

  return (
    <>
      {/* Indian Government Style Header */}
      <Box sx={{ 
        background: `linear-gradient(90deg, ${saffron} 0%, ${white} 50%, ${green} 100%)`,
        height: '8px'
      }} />
      
      {/* Official Header */}
      <Box sx={{ 
        backgroundColor: navy,
        color: white,
        py: showFullHeader ? 2 : 1.5,
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Typography variant={showFullHeader ? "h6" : "body1"} fontWeight="bold">
            भारत निर्वाचन आयोग - Election Commission of India
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {subtitle}
            </Typography>
          )}
        </Container>
      </Box>

      {/* Disclaimer Section */}
      <Box sx={{ 
        backgroundColor: '#ffebee',
        borderLeft: `4px solid #f44336`,
        py: 1.5,
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ color: '#c62828', fontWeight: 'bold', mb: 0.5 }}>
            ⚠️ DISCLAIMER | अस्वीकरण ⚠️
          </Typography>
          <Typography variant="caption" sx={{ color: '#d32f2f', lineHeight: 1.4, display: 'block' }}>
            This is NOT an official system authorized by the Government of India or Election Commission of India. 
            This is purely an academic/educational project for demonstration purposes only.
          </Typography>
          <Typography variant="caption" sx={{ color: '#d32f2f', lineHeight: 1.4, display: 'block' }}>
            यह भारत सरकार या भारत निर्वाचन आयोग द्वारा अधिकृत कोई आधिकारिक प्रणाली नहीं है। 
            यह केवल शैक्षणिक/शिक्षा परियोजना है।
          </Typography>
        </Container>
      </Box>

      {showFullHeader && (
        <Box sx={{ 
          backgroundColor: white,
          borderBottom: `4px solid ${saffron}`,
          py: 3
        }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: navy, mb: 1 }}>
                {title || '🏛️ राष्ट्रीय ई-मतदान पोर्टल'}
              </Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ color: navy }}>
                {title ? '' : 'National E-Voting Portal'}
              </Typography>
              <Typography variant="body1" sx={{ color: green, fontWeight: 'bold', mt: 1 }}>
                सत्यमेव जयते | Truth Alone Triumphs
              </Typography>
            </Box>
          </Container>
        </Box>
      )}
    </>
  );
};

export default IndianGovHeader; 