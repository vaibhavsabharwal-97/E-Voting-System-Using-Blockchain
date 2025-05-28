import * as React from "react";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Box, Chip, CircularProgress, LinearProgress, Alert, Avatar } from "@mui/material";
import axios from "axios";
import { serverLink } from "../../Data/Variables";
import PollIcon from '@mui/icons-material/Poll';

export default function ElectionResult(props) {
  const { title, candidates = [], candidateDisplayNames = [], votes = [], info, index, link, noVotes } = props;
  const [candidateDetails, setCandidateDetails] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Calculate the total votes
  const totalVotes = votes ? votes.reduce((sum, count) => sum + count, 0) : 0;
  
  // Fetch candidate details to display names instead of just usernames
  useEffect(() => {
    async function fetchCandidateDetails() {
      try {
        const details = {};
        
        // Fetch details for each candidate
        for (const username of candidates || []) {
          const response = await axios.get(`${serverLink}candidate/${username}`);
          if (response.data) {
            details[username] = {
              firstName: response.data.firstName || '',
              lastName: response.data.lastName || '',
              fullName: `${response.data.firstName || ''} ${response.data.lastName || ''}`.trim(),
              likes: response.data.likes || 0,
              dislikes: response.data.dislikes || 0
            };
          }
        }
        
        setCandidateDetails(details);
      } catch (error) {
        console.error("Error fetching candidate details:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (candidates && candidates.length > 0 && !candidateDisplayNames.length) {
      fetchCandidateDetails();
    } else {
      setLoading(false);
    }
  }, [candidates, candidateDisplayNames]);
  
  if (loading) {
    return (
      <Card sx={{ minHeight: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: 'secondary.main', 
          color: 'white',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar 
          sx={{ 
            bgcolor: 'white', 
            color: 'secondary.main', 
            width: 60, 
            height: 60,
            mb: 1
          }}
        >
          <PollIcon fontSize="large" />
        </Avatar>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Box>
      
      <CardContent sx={{ flexGrow: 1 }}>
        {noVotes ? (
          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            No votes recorded for this election yet
          </Alert>
        ) : (
          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Votes: <Chip label={totalVotes} size="small" color="primary" />
            </Typography>
          </Box>
        )}
        
        <Typography variant="body2" color="text.secondary" component="div">
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>Candidates:</Typography>
            
            {candidates && candidates.length > 0 ? (
              candidates.map((username, idx) => {
                const voteCount = votes ? votes[idx] || 0 : 0;
                const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                // Use display name from props if available, otherwise from fetched details or fall back to username
                const displayName = candidateDisplayNames[idx] || candidateDetails[username]?.fullName || username;
                
                return (
                  <Box key={idx} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">
                        {displayName}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {voteCount} {totalVotes > 0 && `(${percentage}%)`}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={percentage} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 1,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 1,
                        }
                      }} 
                    />
                    
                    {/* Feedback Stats */}
                    {candidateDetails[username] && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography variant="caption" color="success.main">
                            👍 {candidateDetails[username].likes || 0}
                          </Typography>
                          <Typography variant="caption" color="error.main">
                            👎 {candidateDetails[username].dislikes || 0}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {((candidateDetails[username].likes || 0) + (candidateDetails[username].dislikes || 0))} feedback
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              })
            ) : (
              <Typography variant="body2">No candidates available</Typography>
            )}
          </Box>
        </Typography>
      </CardContent>
      <CardActions>
        <Link to={link} state={{ info: { ...info, candidateDetails, noVotes } }} style={{ textDecoration: 'none', width: '100%' }}>
          <Button size="small" variant="contained" fullWidth>View Details</Button>
        </Link>
      </CardActions>
    </Card>
  );
}
