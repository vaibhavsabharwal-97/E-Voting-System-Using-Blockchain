import React, { useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  Button,
  Container,
  Grid,
  useTheme
} from '@mui/material';
import { HowToVote, CheckCircle, Print } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import VoiceControl from './VoiceControl';

const VoteSlip = ({ voteData }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleString();

  const generatePDF = async () => {
    const content = document.getElementById('vote-slip-content');
    if (!content) return;

    const canvas = await html2canvas(content);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`vote-confirmation-${voteData.voterId}.pdf`);
  };

  useEffect(() => {
    // Automatically generate and download PDF
    generatePDF();

    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 4,
          mb: 4,
          position: 'relative',
          '@media print': {
            margin: 0,
          }
        }}
      >
        <Paper
          id="vote-slip-content"
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: '#fff',
            '@media print': {
              boxShadow: 'none',
            }
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <HowToVote sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Vote Confirmation
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 2 
              }}
            >
              <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="subtitle1" color="success.main">
                Vote Successfully Recorded
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Vote Details */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Election Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {voteData.electionName || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Candidate Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {voteData.candidateName || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Voter ID
              </Typography>
              <Typography variant="body1" gutterBottom>
                {voteData.voterId || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Transaction ID
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ wordBreak: 'break-all' }}>
                {voteData.transactionId || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Date & Time
              </Typography>
              <Typography variant="body1" gutterBottom>
                {currentDate}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              This is your vote confirmation receipt. Please keep it for your records.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Your vote has been securely recorded on the blockchain.
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box 
            sx={{ 
              mt: 3, 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'center',
              '@media print': {
                display: 'none'
              }
            }}
          >
            <Typography variant="body2" color="primary">
              Redirecting to home page in 3 seconds...
            </Typography>
          </Box>
        </Paper>
      </Box>
      
      {/* Floating Voice Control */}
      <VoiceControl 
        step="thankyou" 
        autoPlay={true} 
        variant="floating" 
        showLabel={true}
      />
    </Container>
  );
};

export default VoteSlip; 