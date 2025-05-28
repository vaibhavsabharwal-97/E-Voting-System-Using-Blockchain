import React from 'react';
import { Box, Typography } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const CameraPreview = () => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '400px',
        height: '300px',
        overflow: 'hidden',
        borderRadius: '8px',
        mb: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.03)',
        border: '1px dashed rgba(0, 0, 0, 0.1)'
      }}
    >
      <CameraAltIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2, opacity: 0.5 }} />
      <Typography variant="body1" color="textPrimary" gutterBottom align="center">
        Camera Preview Active
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        Please check the "Face Recognition" window
      </Typography>
      <Typography variant="caption" color="textSecondary" align="center" sx={{ mt: 1 }}>
        Keep the window visible and look at the camera
      </Typography>
    </Box>
  );
};

export default CameraPreview; 