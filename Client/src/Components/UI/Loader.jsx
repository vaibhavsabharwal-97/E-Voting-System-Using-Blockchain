import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { alpha } from '@mui/material/styles';

const Loader = ({ 
  size = 40, 
  text = 'Loading...', 
  showText = true,
  color = 'primary'
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ position: 'relative' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <CircularProgress 
              size={size} 
              color={color}
              thickness={4}
            />
          </motion.div>
          <Box 
            sx={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: size * 0.7,
              height: size * 0.7,
              borderRadius: '50%',
              backgroundColor: (theme) => alpha(theme.palette[color].main, 0.1),
            }}
          />
        </Box>
      </motion.div>
      
      {showText && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          component={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          sx={{ mt: 2, fontWeight: 500 }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Loader; 