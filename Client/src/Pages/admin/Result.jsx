import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Alert,
  Chip,
  Button,
  LinearProgress,
  Tabs,
  Tab,
  Divider,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import { 
  HowToVote, 
  Refresh, 
  Home as HomeIcon,
  TrendingUp as TrendingUpIcon, 
  GroupIcon,
  EmojiEvents as TrophyIcon,
  Poll as PollIcon,
  BarChart as BarChartIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverLink } from '../../Data/Variables';
import { TransactionContext } from '../../context/TransactionContext';
import { ObjectGroupBy } from '../../Data/Methods';

const Result = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState({});
  const { getAllTransactions } = useContext(TransactionContext);
  
  const fetchData = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      // Fetch elections that are in the result phase
      const response = await axios.get(serverLink + 'result/elections');
      setElections(response.data);
      
      // Get all blockchain transactions
      const transactions = await getAllTransactions();
      
      // Process results
      if (response.data.length > 0 && transactions.length > 0) {
        const electionsResults = {};
        
        // Group transactions by election
        const groupedByElection = ObjectGroupBy(transactions, 'election_id');
        
        // For each election, calculate votes per candidate
        for (const election of response.data) {
          if (groupedByElection[election._id]) {
            // Get all votes for this election
            const electionVotes = groupedByElection[election._id];
            
            // Group by candidate
            const candidateVotes = ObjectGroupBy(electionVotes, 'candidate_id');
            
            // Get total votes count
            const totalVotes = electionVotes.length;
            
            // Calculate percentage for each candidate
            const candidateResults = [];
            for (const candidateId in candidateVotes) {
              const votes = candidateVotes[candidateId].length;
              const percentage = (votes / totalVotes) * 100;
              
              // Fetch candidate details
              try {
                const candidateResponse = await axios.get(serverLink + 'candidate/id/' + candidateId);
                const candidateData = candidateResponse.data;
                
                candidateResults.push({
                  candidateId,
                  name: `${candidateData.firstName} ${candidateData.lastName || ''}`,
                  username: candidateData.username,
                  votes,
                  percentage: Math.round(percentage * 100) / 100
                });
              } catch (error) {
                console.error(`Error fetching candidate ${candidateId}:`, error);
              }
            }
            
            // Sort by votes (descending)
            candidateResults.sort((a, b) => b.votes - a.votes);
            
            electionsResults[election._id] = {
              totalVotes,
              candidates: candidateResults
            };
          }
        }
        
        setResults(electionsResults);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [getAllTransactions]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Generate random avatar colors based on username
  const getAvatarColor = (username) => {
    const colors = [
      '#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#ef4444', 
      '#06b6d4', '#ec4899', '#f59e0b', '#6366f1', '#14b8a6'
    ];
    
    // Simple hash function to get consistent color for same username
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  // Get initials from name
  const getInitials = (candidate) => {
    if (candidate.name) {
      const nameParts = candidate.name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return candidate.name.substring(0, 2).toUpperCase();
    }
    if (candidate.username) {
      return candidate.username.substring(0, 2).toUpperCase();
    }
    return 'C';
  };
  
  if (loading && elections.length === 0) {
    return (
      <Box sx={{ 
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <AppBar position="static" elevation={0} sx={{ 
          bgcolor: theme.palette.background.paper, 
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PollIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
              <Typography variant="h5" fontWeight="bold">
                Election Results
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg">
          <Box sx={{ my: 8, textAlign: 'center' }}>
            <LinearProgress sx={{ mt: 2, mb: 4 }} />
            <Typography variant="body1" color="text.secondary">
              Loading election results...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }
  
  if (elections.length === 0) {
    return (
      <Box sx={{ 
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <AppBar position="static" elevation={0} sx={{ 
          bgcolor: theme.palette.background.paper, 
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PollIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
              <Typography variant="h5" fontWeight="bold">
                Election Results
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title="Refresh Data" arrow>
              <IconButton onClick={fetchData}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        
        {/* Breadcrumbs */}
        <Container maxWidth="lg" sx={{ mt: 3, mb: 2 }}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link 
              underline="hover" 
              sx={{ display: 'flex', alignItems: 'center' }} 
              color="inherit" 
              component={RouterLink}
              to="/"
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Link>
            <Link
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
              component={RouterLink}
              to="/admin"
            >
              Admin
            </Link>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              <PollIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Results
            </Typography>
          </Breadcrumbs>
        </Container>
        
        <Container maxWidth="lg">
          <Fade in={true} timeout={800}>
            <Paper
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                mt: 4
              }}
            >
              <AssessmentIcon sx={{ fontSize: 60, color: alpha(theme.palette.primary.main, 0.6), mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Election Results Available
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                There are no elections in the result phase yet. Elections will appear here once voting has concluded.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<Refresh />} 
                onClick={fetchData}
              >
                Refresh
              </Button>
            </Paper>
          </Fade>
        </Container>
      </Box>
    );
  }
  
  const activeElection = elections[activeTab];
  const electionResults = results[activeElection?._id];
  
  return (
    <Box sx={{ 
      bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)',
      minHeight: '100vh',
      pb: 6
    }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ 
        bgcolor: theme.palette.background.paper, 
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PollIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
            <Typography variant="h5" fontWeight="bold">
              Election Results
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Refresh Data" arrow>
            <IconButton onClick={fetchData} sx={{ 
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Breadcrumbs */}
      <Container maxWidth="lg" sx={{ mt: 3, mb: 2 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link 
            underline="hover" 
            sx={{ display: 'flex', alignItems: 'center' }} 
            color="inherit" 
            component={RouterLink}
            to="/"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            component={RouterLink}
            to="/admin"
          >
            Admin
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <PollIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Results
          </Typography>
        </Breadcrumbs>
      </Container>
      
      <Container maxWidth="lg">
        <Fade in={true} timeout={800}>
          <Box sx={{ pt: 2, pb: 6 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Completed Elections
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              View and analyze the final results for completed elections
            </Typography>
            
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                mb: 4,
                borderBottom: `1px solid ${theme.palette.divider}`,
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0'
                },
                '& .MuiTab-root': {
                  minWidth: 'auto',
                  fontWeight: 600,
                  mx: 1,
                  '&.Mui-selected': {
                    color: theme.palette.primary.main
                  }
                }
              }}
            >
              {elections.map((election, index) => (
                <Tab 
                  key={election._id} 
                  label={election.name} 
                  id={`election-tab-${index}`}
                  aria-controls={`election-tabpanel-${index}`}
                  sx={{ textTransform: 'none' }}
                />
              ))}
            </Tabs>
            
            {loading && !electionResults ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                <LinearProgress sx={{ width: '50%' }} />
              </Box>
            ) : electionResults ? (
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ 
                    mb: 3,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      backgroundColor: theme.palette.primary.main,
                    }
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <Avatar 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.primary.main, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          margin: '0 auto',
                          mb: 2,
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`
                        }}
                      >
                        <HowToVoteIcon sx={{ fontSize: 40, color: 'white' }} />
                      </Avatar>
                      <Typography variant="h5" fontWeight="bold">
                        {activeElection.name}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Chip 
                          label={activeElection.currentPhase.charAt(0).toUpperCase() + activeElection.currentPhase.slice(1)} 
                          color="warning" 
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ 
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <BarChartIcon sx={{ mr: 1, color: theme.palette.primary.main }} /> Statistics
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Paper elevation={0} sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            borderRadius: '12px'
                          }}>
                            <Typography color="textSecondary" variant="body2" gutterBottom>
                              Total Votes Cast
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" color="primary">
                              {electionResults.totalVotes}
                            </Typography>
                          </Paper>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Paper elevation={0} sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                            borderRadius: '12px'
                          }}>
                            <Typography color="textSecondary" variant="body2" gutterBottom>
                              Candidates
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" color="secondary">
                              {electionResults.candidates.length}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                      
                      {electionResults.candidates.length > 0 && (
                        <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: '12px' }}>
                          <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ color: theme.palette.success.dark }}>
                            Winner
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.success.dark }}>
                            {electionResults.candidates[0].name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <TrophyIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                            <Typography variant="body2" sx={{ color: theme.palette.success.dark }}>
                              {electionResults.candidates[0].votes} votes ({electionResults.candidates[0].percentage}%)
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Card sx={{ 
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <GroupIcon sx={{ mr: 1, color: theme.palette.primary.main }} /> Candidate Results
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      
                      {electionResults.candidates.map((candidate, index) => (
                        <Box key={candidate.candidateId} sx={{ mb: 3 }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={1}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: getAvatarColor(candidate.username),
                                  boxShadow: index === 0 ? `0 4px 8px ${alpha(getAvatarColor(candidate.username), 0.4)}` : 'none'
                                }}
                              >
                                {getInitials(candidate)}
                              </Avatar>
                            </Grid>
                            <Grid item xs={12} sm={11}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography fontWeight={index === 0 ? 'bold' : 'normal'}>
                                    {index + 1}. {candidate.name}
                                  </Typography>
                                  {index === 0 && (
                                    <Chip 
                                      label="Winner" 
                                      color="success" 
                                      size="small" 
                                      sx={{ ml: 1 }}
                                      icon={<TrophyIcon fontSize="small" />}
                                    />
                                  )}
                                </Box>
                                <Typography fontWeight="bold">
                                  {candidate.votes} votes ({candidate.percentage}%)
                                </Typography>
                              </Box>
                              
                              <Box sx={{ width: '100%', mt: 1, mb: 1 }}>
                                <Box 
                                  sx={{ 
                                    height: 10, 
                                    borderRadius: 5,
                                    bgcolor: alpha(getAvatarColor(candidate.username), 0.2),
                                    position: 'relative',
                                    overflow: 'hidden'
                                  }}
                                >
                                  <Box 
                                    sx={{ 
                                      position: 'absolute',
                                      left: 0,
                                      top: 0,
                                      bottom: 0,
                                      width: `${candidate.percentage}%`,
                                      bgcolor: getAvatarColor(candidate.username),
                                      borderRadius: 5,
                                    }}
                                  />
                                </Box>
                              </Box>
                              
                              <Typography variant="body2" color="text.secondary">
                                @{candidate.username}
                              </Typography>
                            </Grid>
                          </Grid>
                          {index < electionResults.candidates.length - 1 && (
                            <Divider sx={{ my: 2 }} />
                          )}
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                <LinearProgress sx={{ width: '50%' }} />
              </Box>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Result; 