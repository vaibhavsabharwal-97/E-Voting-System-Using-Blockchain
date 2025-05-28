import React, { useContext, useState, useEffect } from "react";
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Container,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Alert,
  useTheme,
  Stack
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined, Person } from '@mui/icons-material';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { useLocation, useNavigate } from "react-router-dom";
import { TransactionContext } from "../context/TransactionContext";
import { serverLink, isFaceRecognitionEnable } from "../Data/Variables";
import { ObjectGroupBy } from "../Data/Methods";
import axios from "axios";
import VoteSlip from "../Components/VoteSlip";
import VoteConfirmationOverlay from "../Components/VoteConfirmationOverlay";
import { useUser } from "../context/UserContext";
import VoiceControl from "../Components/VoiceControl";

const Login = () => {
  const location = useLocation();
  const data = location.state.info;
  const { connectWallet, sendTransaction, getAllTransactions, showVoteOverlay } = useContext(TransactionContext);
  const { authenticatedUser } = useUser();
  const [election, setElection] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [showVoteSlip, setShowVoteSlip] = useState(false);
  const [voteData, setVoteData] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    connectWallet();

    async function getData() {
      console.log(data);
      let link = serverLink + "election/" + data.election_id;
      let res = await axios.get(link);
      let election = res.data;
      setElection(election);
    }
    getData();
  }, []);

  const checkDuplicateVote = async (user_id) => {
    try {
      console.log("Checking for duplicate votes for user_id:", user_id, "in election:", election._id);
      
      // Get all blockchain transactions
      const transactions = await getAllTransactions();
      console.log("All transactions:", transactions);
      
      // Group transactions by election ID
      const electionGroup = ObjectGroupBy(transactions, "election_id");
      console.log("Transactions for this election:", electionGroup[election._id] || []);
      
      // If no transactions for this election yet, user hasn't voted
      if (!electionGroup[election._id]) {
        console.log("No votes found for this election");
        return false;
      }
      
      // Group transactions by user ID to check if this user has voted
      const userVotes = transactions.filter(tx => 
        tx.election_id === election._id && tx.user_id === user_id
      );
      console.log("User's votes for this election:", userVotes);
      
      // If user has already voted in this election
      if (userVotes && userVotes.length > 0) {
        console.log("Duplicate vote detected!");
        setAlert({
          show: true,
          message: 'You have already voted in this election',
          severity: 'error'
        });
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/elections');
        }, 3000);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error checking for duplicate votes:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, message: '', severity: 'success' });
    
    try {
      // Use the authenticated user from context
      const user = authenticatedUser;
      
      // Check for duplicate votes before proceeding
      const isDuplicate = await checkDuplicateVote(user._id);
      if (isDuplicate) {
        setLoading(false);
        return;
      }
      
      // Send transaction to blockchain
      const trans = await sendTransaction(
        data.election_id,
        data.candidate_id,
        user._id
      );

      if (trans.valid) {
        try {
          // Send confirmation email
          await axios.post(serverLink + "votingEmail", { id: user._id });
          
          // Set vote data for the slip
          setVoteData({
            transactionId: trans.hash,
            electionName: election.name,
            candidateName: data.candidate_username,
            voterId: user._id
          });
          
          // Show vote slip
          setShowVoteSlip(true);
          
          setAlert({
            show: true,
            message: 'Thank you for voting! Your vote has been recorded on the blockchain.',
            severity: 'success'
          });
        } catch (error) {
          console.error("Error in post-transaction processing:", error);
          setAlert({
            show: true,
            message: 'Vote recorded, but there was an error sending the confirmation email.',
            severity: 'warning'
          });
        }
      } else {
        setAlert({
          show: true,
          message: trans.mess || 'Transaction failed',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error("Voting error:", error);
      setAlert({
        show: true,
        message: error.response?.data || 'An error occurred during voting',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (showVoteSlip) {
    return <VoteSlip voteData={voteData} />;
  }

  return (
    <>
      {/* Vote Confirmation Overlay */}
      {showVoteOverlay && (
        <VoteConfirmationOverlay
          username={data.user_username}
          electionId={data.election_id}
          candidateName={data.candidate_username}
        />
      )}

      <Container maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Card 
            sx={{ 
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                py: 4,
                bgcolor: theme.palette.primary.main,
                color: 'white',
                textAlign: 'center',
                mb: 3,
                background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
              }}
            >
              <LockOutlined sx={{ fontSize: 48, mb: 1 }} />
              <Typography component="h1" variant="h5" fontWeight="bold">
                Secure Voting Authentication
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Verify your identity to cast your vote
              </Typography>
            </Box>
            
            <CardContent sx={{ px: 4, pb: 4 }}>
              {alert.show && (
                <Alert 
                  severity={alert.severity} 
                  sx={{ mb: 3, borderRadius: 1 }}
                  onClose={() => setAlert({ ...alert, show: false })}
                >
                  {alert.message}
                </Alert>
              )}
                
              <form onSubmit={handleSubmit} method="POST">
                <Stack spacing={3}>
                  <TextField
                    label="Username"
                    name="username"
                    fullWidth
                    value={data.user_username || ""}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  
                  <TextField
                    label="Election ID"
                    name="election_id"
                    fullWidth
                    value={data.election_id}
                    disabled
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <HowToVoteIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  
                  <TextField
                    label="Candidate Name"
                    name="candidate_name"
                    fullWidth
                    value={data.candidate_username}
                    disabled
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ px: 2, pb: 1 }}>
                      By clicking "Vote", your vote will be securely recorded on the blockchain.
                    </Typography>
                  </Box>
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ 
                      py: 1.5, 
                      mt: 1,
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      background: loading ? '' : 'linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)',
                      '&:hover': {
                        background: loading ? '' : 'linear-gradient(90deg, #3a0ca3 0%, #4361ee 100%)',
                      },
                      boxShadow: '0 4px 10px rgba(67, 97, 238, 0.3)',
                    }}
                  >
                    {loading ? 'Processing...' : 'Confirm'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/elections')}
                    sx={{ 
                      mt: 1,
                      borderRadius: 2,
                      py: 1.2,
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Container>
      
      {/* Floating Voice Control */}
      <VoiceControl 
        step="verify" 
        autoPlay={true} 
        variant="floating" 
        showLabel={true}
      />
    </>
  );
};

export default Login;