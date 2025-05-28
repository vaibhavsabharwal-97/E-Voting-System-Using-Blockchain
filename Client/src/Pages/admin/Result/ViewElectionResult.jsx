import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Grid, 
  Typography, 
  Box, 
  Paper,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Divider,
  Container,
  Button,
  Alert
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentHeader from "../../../Components/ContentHeader";
import ElectionGraphs from "../../../Components/ElectionGraphs";
import { stringToColor } from "../../../Data/Methods";
import axios from "axios";
import { serverLink, staticFileLink } from "../../../Data/Variables";
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PersonIcon from '@mui/icons-material/Person';
import { TransactionContext } from "../../../context/TransactionContext";

const ViewElectionResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getAllTransactions } = useContext(TransactionContext);
  const [candidateDetails, setCandidateDetails] = useState({});
  const [voterAgeData, setVoterAgeData] = useState({});
  const [voterStats, setVoterStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the election data from location state
  const electionData = location.state?.info;
  
  // Fetch voter age demographics data
  const fetchVoterAgeData = async () => {
    if (!electionData?._id) return;
    try {
      const response = await axios.get(`${serverLink}election/${electionData._id}/voter-demographics`);
      if (response.data) {
        setVoterAgeData(response.data.ageDistribution);
      }
    } catch (error) {
      console.error("Error fetching voter demographics:", error);
    }
  };

  // Fetch detailed information about each candidate if not already provided
  useEffect(() => {
    if (!electionData) return;
    
    async function fetchData() {
      try {
        const { candidates = [] } = electionData;
        // Check if we already have candidate details from the previous screen
        if (!electionData.candidateDetails) {
          const details = {};
          
          // Fetch details for each candidate
          for (const username of candidates) {
            const response = await axios.get(`${serverLink}candidate/${username}`);
            if (response.data) {
              details[username] = {
                id: response.data._id,
                firstName: response.data.firstName || '',
                lastName: response.data.lastName || '',
                fullName: `${response.data.firstName || ''} ${response.data.lastName || ''}`.trim(),
                location: response.data.location || '',
                qualification: response.data.qualification || '',
                likes: response.data.likes || 0,
                dislikes: response.data.dislikes || 0
              };
            }
          }
          
          setCandidateDetails(details);
        } else {
          setCandidateDetails(electionData.candidateDetails);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [electionData]);

  useEffect(() => {
    if (!electionData?._id) return;
    
    const fetchVoterStats = async () => {
      try {
        // Get voter stats from database
        const baseUrl = staticFileLink.replace(/\/$/, '');
        const response = await axios.get(`${baseUrl}/api/election/${electionData._id}/voter-stats`);
        console.log('Voter stats response:', response.data);

        // Get blockchain transactions
        const transactions = await getAllTransactions();
        console.log('Blockchain transactions:', transactions);
        
        // Count votes for this election from blockchain
        const electionVotes = transactions.filter(tx => tx.election_id === electionData._id);
        const blockchainVoteCount = electionVotes.length;
        console.log('Blockchain vote count:', blockchainVoteCount);

        // Use the higher count between database and blockchain
        const totalVotesCast = Math.max(response.data.totalVotesCast, blockchainVoteCount);

        setVoterStats({
          ...response.data,
          totalVotesCast
        });
      } catch (error) {
        console.error("Error fetching voter statistics:", error);
        setError("Failed to load voter statistics");
      }
    };

    fetchVoterStats();
  }, [electionData, getAllTransactions]);

  // If no data was passed, show error
  if (!electionData) {
    return (
      <div className="admin__content">
        <ContentHeader title="Back to Results" link="/admin/result" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography variant="h6" color="error">
            No election data found. Please go back to the results page.
          </Typography>
        </Box>
      </div>
    );
  }
  
  // Extract data from the election
  const { name, candidates = [], candidateDisplayNames = [], vote = [], noVotes = false } = electionData;
  
  // Calculate the total votes
  const totalVotes = vote.reduce((sum, count) => sum + count, 0);
  
  // Create a sorted array of candidates with their vote counts
  const candidateResults = candidates.map((username, index) => ({
    username,
    displayName: candidateDisplayNames[index] || username,
    votes: vote[index] || 0
  }))
  .sort((a, b) => b.votes - a.votes); // Sort by votes (highest first)
  
  // Find the candidate with the most votes (winner)
  const winner = candidateResults.length > 0 && candidateResults[0].votes > 0 
    ? candidateResults[0] 
    : null;

  if (loading) {
    return (
      <div className="admin__content">
        <ContentHeader title="Back to Results" link="/admin/result" />
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
        </Box>
      </div>
    );
  }

  return (
    <div className="admin__content">
      <ContentHeader title="Back to Results" link="/admin/result" />
      
      <Container maxWidth="lg" sx={{ mt: 2, pb: 4 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              {name} - Election Results
            </Typography>
            
            {noVotes && (
              <Alert 
                severity="info" 
                sx={{ 
                  width: '100%', 
                  maxWidth: 600, 
                  mt: 2, 
                  mb: 2,
                  '& .MuiAlert-message': { width: '100%' } 
                }}
              >
                <Typography variant="subtitle1" align="center">
                  No votes have been recorded for this election yet
                </Typography>
                <Typography variant="body2" align="center">
                  Results will appear here once votes are cast and recorded on the blockchain
                </Typography>
              </Alert>
            )}
            
            {!noVotes && (
              <Box sx={{ width: '100%', maxWidth: 600, mt: 2 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                      <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h6" gutterBottom>
                        Registered Voters
                      </Typography>
                      <Typography variant="h4" color="primary.main">
                        {voterStats?.totalRegisteredVoters || 0}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                      <HowToVoteIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                      <Typography variant="h6" gutterBottom>
                        Votes Cast
                      </Typography>
                      <Typography variant="h4" color="secondary.main">
                        {voterStats?.totalVotesCast || 0}
                      </Typography>
                      {voterStats && (
                        <Typography variant="body2" color="text.secondary">
                          ({((voterStats.totalVotesCast / voterStats.totalRegisteredVoters) * 100).toFixed(1)}% turnout)
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                </Grid>

                <Typography variant="subtitle1" align="center" gutterBottom>
                  Total Votes: {totalVotes}
                </Typography>
                
                {winner && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Winner
                    </Typography>
                    <Avatar
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        mx: 'auto', 
                        mb: 1, 
                        bgcolor: stringToColor(candidateDetails[winner.username]?.fullName || winner.username)
                      }}
                    >
                      {candidateDetails[winner.username]?.firstName?.[0] || ''}
                      {candidateDetails[winner.username]?.lastName?.[0] || ''}
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold">
                      {candidateDetails[winner.username]?.fullName || winner.displayName || winner.username}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      {winner.votes} votes ({Math.round((winner.votes / totalVotes) * 100)}%)
                    </Typography>
                    {candidateDetails[winner.username] && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        👍 {candidateDetails[winner.username].likes || 0} likes • 
                        👎 {candidateDetails[winner.username].dislikes || 0} dislikes
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>
          
          {!noVotes && <ElectionGraphs candidateResults={candidateResults} electionInfo={electionData} />}
          
          <Divider sx={{ mb: 4 }} />
          
          <Typography variant="h6" gutterBottom>
            All Candidates {noVotes ? '' : 'Results'}
          </Typography>
          
          <Grid container spacing={3}>
            {candidateResults.map((candidate, index) => {
              const { username, displayName, votes } = candidate;
              const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
              
              return (
                <Grid item xs={12} sm={6} md={4} key={username}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{ 
                            bgcolor: stringToColor(candidateDetails[username]?.fullName || username),
                            mr: 2
                          }}
                        >
                          {candidateDetails[username]?.firstName?.[0] || ''}
                          {candidateDetails[username]?.lastName?.[0] || ''}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {candidateDetails[username]?.fullName || displayName || username}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {candidateDetails[username]?.location || ''}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Feedback Stats */}
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Typography variant="body2" color="success.main">
                            👍 {candidateDetails[username]?.likes || 0}
                          </Typography>
                          <Typography variant="body2" color="error.main">
                            👎 {candidateDetails[username]?.dislikes || 0}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {((candidateDetails[username]?.likes || 0) + (candidateDetails[username]?.dislikes || 0))} total feedback
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Votes:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {votes} ({percentage.toFixed(1)}%)
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={percentage} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin/result')}
            >
              Back to Results
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default ViewElectionResult;
