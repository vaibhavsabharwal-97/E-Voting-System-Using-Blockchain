import React from 'react';
import { Box, Card, CardContent, Typography, useTheme, alpha } from '@mui/material';

const StatsCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography 
              variant="subtitle2" 
              color="textSecondary" 
              gutterBottom
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              fontWeight="bold"
              color="textPrimary"
            >
              {value}
            </Typography>
          </Box>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            sx={{ 
              width: 56, 
              height: 56, 
              borderRadius: '50%', 
              backgroundColor: alpha(color || theme.palette.primary.main, 0.1),
            }}
          >
            {React.cloneElement(icon, { 
              sx: { 
                color: color || theme.palette.primary.main,
                fontSize: 28
              } 
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard; 