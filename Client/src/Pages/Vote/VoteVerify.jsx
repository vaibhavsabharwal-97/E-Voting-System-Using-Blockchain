import React, { useState } from 'react';
import { Box, Container, Stack, TextField, Typography, Button, InputAdornment, Alert } from '@mui/material';
import { AccountCircle, Person, HowToVote } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { serverLink } from '../../Data/Variables';
import VoiceControl from '../../Components/VoiceControl';

const VoteVerify = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fatherName: '',
    electionId: '',
    candidateName: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post(serverLink + 'api/auth/login', {
        username: formData.username,
        fatherName: formData.fatherName
      });

      if (response.status === 201) {
        // Proceed with voting
        try {
          const voteResponse = await axios.post(serverLink + 'api/vote/cast', {
            userId: response.data._id,
            electionId: formData.electionId,
            candidateName: formData.candidateName
          });
          
          if (voteResponse.status === 201) {
            // Vote successful
            navigate('/vote/success');
          }
        } catch (voteError) {
          setError(voteError.response?.data || 'Error casting vote. Please try again.');
        }
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setError(error.response?.data || "Invalid Father's Name");
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        textAlign: 'center',
        py: 4
      }}>
        <AccountCircle sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h5" fontWeight="bold">
          Secure Voting Authentication
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
          Verify your identity to cast your vote
        </Typography>
      </Box>

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {error && (
              <Alert severity="error" onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Election ID"
              name="electionId"
              value={formData.electionId}
              onChange={(e) => setFormData({ ...formData, electionId: e.target.value })}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HowToVote />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Candidate Name"
              name="candidateName"
              value={formData.candidateName}
              onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Father's Name"
              name="fatherName"
              value={formData.fatherName}
              onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />

            <Typography variant="body2" color="text.secondary" align="center">
              By clicking "Vote", your vote will be securely recorded on the blockchain.
            </Typography>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                py: 1.5,
                mt: 2,
                background: 'linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #3a0ca3 0%, #4361ee 100%)',
                },
              }}
            >
              Vote
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </Container>
      
      {/* Floating Voice Control */}
      <VoiceControl 
        step="camera" 
        autoPlay={true} 
        variant="floating" 
        showLabel={true}
      />
    </Box>
  );
};

export default VoteVerify; 