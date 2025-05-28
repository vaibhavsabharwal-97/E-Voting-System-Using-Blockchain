import React, { useContext, useState, useEffect } from "react";
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  CircularProgress, 
  Alert, 
  Avatar, 
  Card, 
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  Stack,
  Divider
} from "@mui/material";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { TransactionContext } from "../context/TransactionContext";
import { serverLink } from "../Data/Variables";
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import VoteConfirmationOverlay from "../Components/VoteConfirmationOverlay";
import axios from "axios";
import VoiceControl from "../Components/VoiceControl";

const VotePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const voteData = location.state?.voteData;
  const [election, setElection] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });
  const { connectWallet, sendTransaction, getAllTransactions, showVoteOverlay, voteData: transactionVoteData } = useContext(TransactionContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Connect wallet first
        await connectWallet();
        
        if (!voteData) {
          setStatus({
            type: "error",
            message: "No voting data found. Please select a candidate first."
          });
          setLoading(false);
          return;
        }

        // Fetch election details
        const electionResponse = await axios.get(`${serverLink}election/${voteData.election_id}`);
        setElection(electionResponse.data);

        // Fetch candidate details
        const candidateResponse = await axios.get(`${serverLink}candidate/${voteData.candidate_id}`);
        setCandidate(candidateResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setStatus({
          type: "error",
          message: "Failed to load voting information. Please try again."
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [voteData, connectWallet]);

  const checkDuplicateVote = async (userId) => {
    try {
      const transactions = await getAllTransactions();
      const electionTransactions = transactions.filter(tx => tx.election_id === voteData.election_id);
      const userVotes = electionTransactions.filter(tx => tx.user_id === userId);
      
      return userVotes.length > 0;
    } catch (error) {
      console.error("Error checking for duplicate votes:", error);
      return false;
    }
  };

  const handleVoteSubmit = async () => {
    setProcessing(true);
    setStatus({ type: null, message: "" });
    
    try {
      // Ensure wallet is connected
      const account = await connectWallet();
      if (!account) {
        setStatus({
          type: "error",
          message: "Please connect your MetaMask wallet to proceed."
        });
        setProcessing(false);
        return;
      }
      
      // Check if user has already voted
      const isDuplicate = await checkDuplicateVote(voteData.user_id);
      if (isDuplicate) {
        setStatus({
          type: "error",
          message: "You have already voted in this election."
        });
        setProcessing(false);
        return;
      }
      
      // Send transaction to blockchain
      const transaction = await sendTransaction(
        voteData.election_id,
        voteData.candidate_id,
        voteData.user_id
      );

      if (transaction.valid) {
        try {
          // Save vote in database
          const voteResponse = await axios.post(`${serverLink}api/vote`, {
            electionId: voteData.election_id,
            voterId: voteData.user_id,
            candidateId: voteData.candidate_id
          });
          
          // Send confirmation email
          await axios.post(`${serverLink}votingEmail`, { id: voteData.user_id });
          
          setStatus({
            type: "success",
            message: "Your vote has been successfully recorded!"
          });
          
          // Redirect after 3 seconds
          setTimeout(() => {
            navigate('/elections');
          }, 3000);
        } catch (error) {
          console.error("Error saving vote:", error);
          setStatus({
            type: "error",
            message: "Failed to save your vote. Please try again or contact support."
          });
        }
      } else {
        setStatus({
          type: "error",
          message: transaction.mess || "Failed to record your vote. Please try again."
        });
      }
    } catch (error) {
      console.error("Error during voting process:", error);
      setStatus({
        type: "error",
        message: "An error occurred while processing your vote. Please try again."
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (status.type === "error" && !election) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 5 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {status.message}
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/elections')}
          >
            Return to Elections
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static" color="primary" elevation={0} sx={{ py: 1 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="div" sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
              Blockchain E-Voting System
            </Typography>
            <Box>
              <Button 
                color="inherit" 
                component={Link} 
                to="/elections" 
                sx={{ ml: 2 }}
              >
                Elections
              </Button>
            </Box>
          </Box>
        </Container>
      </AppBar>

      {showVoteOverlay && (
        <VoteConfirmationOverlay
          username={voteData?.user_id}
          electionId={voteData?.election_id}
          candidateName={candidate?.firstName ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'}
        />
      )}

      <Container maxWidth="md" sx={{ mt: 5 }}>
        {/* Voice Control for Vote Confirmation Step */}
        <VoiceControl 
          step="confirm" 
          autoPlay={true} 
          variant="inline" 
          showLabel={true}
        />
        
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" gutterBottom>
            Confirm Your Vote
          </Typography>
        </Box>

        {status.type && (
          <Alert 
            severity={status.type} 
            sx={{ mb: 3 }}
            icon={status.type === "success" ? <CheckCircleIcon /> : <ErrorIcon />}
          >
            {status.message}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Election Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {election && (
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Election Name
                    </Typography>
                    <Typography variant="body1">
                      {election.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Current Phase
                    </Typography>
                    <Typography variant="body1">
                      {election.currentPhase}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Election ID
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                      {election._id}
                    </Typography>
                  </Box>
                </Stack>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Selected Candidate
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {candidate && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      mb: 2, 
                      bgcolor: 'primary.main',
                      fontSize: '2rem'
                    }}
                  >
                    {candidate.firstName?.[0] || 'C'}
                  </Avatar>
                  <Typography variant="h6" align="center">
                    {candidate.firstName} {candidate.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                    {candidate.location}
                  </Typography>
                  {candidate.description && (
                    <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                      {candidate.description}
                    </Typography>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Card sx={{ mt: 4, mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <CardContent>
            <Typography variant="body1" align="center">
              Please verify your selection above. Once submitted, your vote cannot be changed.
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<HowToVoteIcon />}
            onClick={handleVoteSubmit}
            disabled={processing || status.type === "success"}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            {processing ? "Processing..." : "Confirm Vote"}
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default VotePage; 