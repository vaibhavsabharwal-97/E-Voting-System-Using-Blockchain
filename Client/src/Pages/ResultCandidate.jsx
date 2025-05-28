import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { 
  Grid, 
  Typography, 
  Box, 
  Container, 
  Paper, 
  Card, 
  CardContent,
  Avatar,
  LinearProgress,
  Divider,
  Button,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
  alpha,
  Fade,
  Chip,
  CircularProgress,
  Tooltip,
  Badge
} from "@mui/material";
import { 
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Poll as PollIcon,
  EmojiEvents as TrophyIcon,
  LocationOn as LocationIcon,
  School as EducationIcon,
  Person as PersonIcon,
  HowToVote as VoteIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { stringToColor } from "../Data/Methods";
import axios from "axios";
import { serverLink } from "../Data/Variables";
import MainNavbar from "../Components/User/MainNavbar";
import { motion } from "framer-motion";
import ElectionResultGraphs from "../Components/User/ElectionResultGraphs";

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

const ResultCandidate = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.info;
  const [candidateDetails, setCandidateDetails] = useState({});
  const [voterAgeData, setVoterAgeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!data || !data.candidates || data.candidates.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const details = {};
        
        // Fetch details for each candidate
        for (const username of data.candidates) {
          try {
            const response = await axios.get(`${serverLink}candidate/${username}`);
            if (response.data) {
              details[username] = {
                ...response.data,
                fullName: `${response.data.firstName || ''} ${response.data.lastName || ''}`.trim()
              };
            }
          } catch (error) {
            console.error(`Error fetching details for candidate ${username}:`, error);
          }
        }
        
        setCandidateDetails(details);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [data]);

  // If no data was passed, show error
  if (!data) {
    return (
      <>
        <MainNavbar />
        <Container maxWidth="md" sx={{ my: 6 }}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ 
              p: 4, 
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                  margin: '0 auto',
                  mb: 2
                }}
              >
                <PollIcon sx={{ fontSize: 40 }} />
              </Avatar>
            </Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              No Election Data Found
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 3 }}>
              The election data could not be found. Please return to the results page.
            </Typography>
            <Button 
              variant="contained"
              component={Link}
              to="/result"
              startIcon={<ArrowBackIcon />}
              sx={{ 
                mt: 2,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                }
              }}
            >
              Back to Results
            </Button>
          </MotionPaper>
        </Container>
      </>
    );
  }

  // Extract data from the election
  const { name, candidates = [], vote = [], noVotes = false } = data;
  
  // Calculate the total votes
  const totalVotes = vote.reduce((sum, count) => sum + count, 0);
  
  // Create a sorted array of candidates with their vote counts
  const candidateResults = candidates.map((username, index) => ({
    username,
    votes: vote[index] || 0
  }))
  .sort((a, b) => b.votes - a.votes); // Sort by votes (highest first)

  // Find the candidate with the most votes (winner)
  const winner = candidateResults.length > 0 ? candidateResults[0] : null;
  const hasWinner = winner && winner.votes > 0;
  
  // Get avatar color for winner
  const getWinnerColor = () => {
    if (!hasWinner) return theme.palette.primary.main;
    return stringToColor(candidateDetails[winner.username]?.fullName || winner.username);
  };

  return (
    <Box sx={{ 
      bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)',
      minHeight: '100vh',
      pb: 6
    }}>
      <MainNavbar />
      
      {/* Breadcrumbs */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 2 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <MuiLink
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            component={Link}
            to="/"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </MuiLink>
          <MuiLink
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            component={Link}
            to="/result"
          >
            <PollIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Results
          </MuiLink>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            {name}
          </Typography>
        </Breadcrumbs>
      </Container>
      
      <Container maxWidth="xl">
        <Fade in={true} timeout={800}>
          <Box>
            {/* Election Title */}
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
              {name}
            </Typography>

            {/* Winner Section */}
            {hasWinner && (
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 2,
                  bgcolor: alpha(getWinnerColor(), 0.05),
                  border: `1px solid ${alpha(getWinnerColor(), 0.1)}`,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Avatar sx={{ bgcolor: getWinnerColor(), width: 32, height: 32 }}>
                        <TrophyIcon />
                      </Avatar>
                    }
                  >
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: alpha(getWinnerColor(), 0.2),
                        color: getWinnerColor(),
                        mb: 2
                      }}
                    >
                      {candidateDetails[winner.username]?.firstName?.[0] || ''}
                      {candidateDetails[winner.username]?.lastName?.[0] || ''}
                    </Avatar>
                  </Badge>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {candidateDetails[winner.username]?.fullName || winner.username}
                  </Typography>
                                      <Typography variant="subtitle1" color={getWinnerColor()}>
                    Winner • {winner.votes} votes ({Math.round((winner.votes / totalVotes) * 100)}%)
                  </Typography>
                  {candidateDetails[winner.username] && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      👍 {candidateDetails[winner.username].likes || 0} likes • 
                      👎 {candidateDetails[winner.username].dislikes || 0} dislikes
                    </Typography>
                  )}
                </Box>
              </MotionPaper>
            )}

            {/* Analytics Section */}
            {!noVotes && (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" color="textSecondary">
                    Analytics
                  </Typography>
                </Box>
                <ElectionResultGraphs
                  candidateResults={candidateResults.map(result => ({
                    username: result.username,
                    votes: result.votes
                  }))}
                  loading={loading}
                />
              </>
            )}

            {/* Candidates Grid */}
            <Typography variant="h5" sx={{ mt: 6, mb: 3 }} fontWeight="600">
              All Candidates
            </Typography>
            <Grid container spacing={3}>
              {candidateResults.map((result, index) => (
                <Grid item xs={12} sm={6} md={4} key={result.username}>
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: stringToColor(candidateDetails[result.username]?.fullName || result.username),
                            mr: 2
                          }}
                        >
                          {candidateDetails[result.username]?.firstName?.[0] || ''}
                          {candidateDetails[result.username]?.lastName?.[0] || ''}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="600">
                            {candidateDetails[result.username]?.fullName || result.username}
                          </Typography>
                          {hasWinner && winner.username === result.username && (
                            <Chip
                              icon={<TrophyIcon />}
                              label="Winner"
                              size="small"
                              color="warning"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        {candidateDetails[result.username]?.location && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {candidateDetails[result.username].location}
                            </Typography>
                          </Box>
                        )}
                        {candidateDetails[result.username]?.qualification && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EducationIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {candidateDetails[result.username].qualification}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
                          {result.votes}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Votes Received
                        </Typography>
                        {totalVotes > 0 && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            ({Math.round((result.votes / totalVotes) * 100)}% of total)
                          </Typography>
                        )}
                        
                        {/* Feedback Stats */}
                        {candidateDetails[result.username] && (
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Typography variant="body2" color="success.main">
                              👍 {candidateDetails[result.username].likes || 0}
                            </Typography>
                            <Typography variant="body2" color="error.main">
                              👎 {candidateDetails[result.username].dislikes || 0}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default ResultCandidate;
