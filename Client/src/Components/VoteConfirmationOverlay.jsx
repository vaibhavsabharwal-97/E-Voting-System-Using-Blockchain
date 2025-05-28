import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import VoiceControl from './VoiceControl';

const VoteConfirmationOverlay = ({ username, electionId, candidateName }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: '425px',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        zIndex: 99999,
        pointerEvents: 'none',
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: '400px',
          maxWidth: '90%',
          mt: 2,
          p: 3,
          borderRadius: 2,
          backgroundColor: '#fff',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          pointerEvents: 'auto',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '20px',
            right: '-10px',
            width: '20px',
            height: '20px',
            backgroundColor: '#fff',
            transform: 'rotate(45deg)',
            boxShadow: '4px -4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: -1,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LockIcon
            sx={{
              fontSize: 28,
              color: 'primary.main',
              mr: 1
            }}
          />
          <Typography variant="h6" fontWeight="bold">
            Secure Voting Authentication
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Verify your identity to cast your vote
        </Typography>

        {/* Voice Control for Transaction Confirmation Step */}
        <VoiceControl 
          step="thankyou" 
          autoPlay={false} 
          variant="inline" 
          showLabel={true}
        />

        <Box sx={{ mb: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Username
            </Typography>
            <Typography variant="body1" fontWeight="500">
              {username}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Election ID
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                wordBreak: 'break-all',
                fontSize: '0.9rem'
              }} 
              fontWeight="500"
            >
              {electionId}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Candidate Name
            </Typography>
            <Typography variant="body1" fontWeight="500">
              {candidateName}
            </Typography>
          </Box>
        </Box>

        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            display: 'block', 
            mb: 2,
            textAlign: 'center',
            fontSize: '0.75rem'
          }}
        >
          Please confirm the transaction in MetaMask →
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}>
          <CircularProgress size={20} thickness={4} sx={{ color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary">
            Waiting for confirmation...
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default VoteConfirmationOverlay; 