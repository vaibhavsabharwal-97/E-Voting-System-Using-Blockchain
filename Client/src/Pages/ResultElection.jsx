import { 
  Typography, 
  Box, 
  Paper, 
  CircularProgress, 
  Alert, 
  Button, 
  Container,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
  alpha,
  Fade,
  Avatar,
  TextField,
  InputAdornment,
  Pagination,
  Divider,
  Tooltip,
  Chip,
  Collapse,
  Grid
} from "@mui/material";
import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { serverLink } from "../Data/Variables";
import { getResult } from "../Data/Methods";
import { TransactionContext } from "../context/TransactionContext";
import { Link } from "react-router-dom";
import { 
  Home as HomeIcon,
  HowToVote as HowToVoteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Assessment as AssessmentIcon,
  Poll as PollIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { motion } from "framer-motion";
import MainNavbar from "../Components/User/MainNavbar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

// Add this new component for the election card graphs
const ElectionCardGraphs = ({ item, electionInfo }) => {
  const [expanded, setExpanded] = useState(false);
  const [voterAgeData, setVoterAgeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  
  const fetchVoterAgeData = useCallback(async () => {
    if (!item._id || voterAgeData) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${serverLink}election/${item._id}/voter-demographics`);
      if (response.data?.ageDistribution) {
        setVoterAgeData(response.data.ageDistribution);
      }
    } catch (error) {
      console.error("Error fetching voter demographics:", error);
    } finally {
      setLoading(false);
    }
  }, [item._id, voterAgeData]);

  useEffect(() => {
    if (expanded && !voterAgeData && item._id) {
      fetchVoterAgeData();
    }
  }, [expanded, item._id, voterAgeData, fetchVoterAgeData]);

  // Prepare data for charts
  const voteDistributionData = {
    labels: item.candidates.map((candidate, index) => {
      // Use display names from electionInfo or candidate name from item
      return electionInfo?.candidateDisplayNames?.[index] || item.info?.candidateDisplayNames?.[index] || candidate;
    }),
    datasets: [
      {
        label: 'Number of Votes',
        data: item.vote,
        backgroundColor: [
          alpha(theme.palette.primary.main, 0.7),
          alpha(theme.palette.secondary.main, 0.7),
          alpha(theme.palette.error.main, 0.7),
          alpha(theme.palette.warning.main, 0.7),
          alpha(theme.palette.success.main, 0.7),
        ],
        borderColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.error.main,
          theme.palette.warning.main,
          theme.palette.success.main,
        ],
        borderWidth: 1,
      },
    ],
  };

  const voteDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: theme.palette.text.secondary,
        },
        grid: {
          color: alpha(theme.palette.divider, 0.1),
        },
      },
      x: {
        ticks: {
          color: theme.palette.text.secondary,
        },
        grid: {
          color: alpha(theme.palette.divider, 0.1),
        },
      },
    },
  };

  // Prepare data for age demographics chart
  const ageDistributionData = voterAgeData ? {
    labels: ['18-25', '26-35', '36-45', '46-55', '56+'],
    datasets: [
      {
        data: [
          voterAgeData['18-25'] || 0,
          voterAgeData['26-35'] || 0,
          voterAgeData['36-45'] || 0,
          voterAgeData['46-55'] || 0,
          voterAgeData['56+'] || 0,
        ],
        backgroundColor: [
          alpha(theme.palette.primary.main, 0.6),
          alpha(theme.palette.secondary.main, 0.6),
          alpha(theme.palette.success.main, 0.6),
          alpha(theme.palette.info.main, 0.6),
          alpha(theme.palette.warning.main, 0.6),
        ],
        borderColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main,
          theme.palette.info.main,
          theme.palette.warning.main,
        ],
        borderWidth: 2,
      },
    ],
  } : null;

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          boxWidth: 12,
          font: {
            size: 11,
            weight: 500,
          },
          padding: 15,
          color: theme.palette.text.primary,
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          onClick={() => setExpanded(!expanded)}
          startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{
            color: theme.palette.primary.main,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }
          }}
        >
          {expanded ? 'Hide Analytics' : 'Show Analytics'}
        </Button>
      </Box>
      
      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ mb: 2 }} />
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={40} thickness={4} />
            </Box>
          ) : (
            <>
              {/* Vote Distribution Chart */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom align="center" fontWeight="600" color="primary">
                  Vote Distribution
                </Typography>
                <Box sx={{ height: 250, p: 2 }}>
                  <Bar data={voteDistributionData} options={voteDistributionOptions} />
                </Box>
              </Box>
              
              {/* Age Demographics Chart */}
              {voterAgeData && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom align="center" fontWeight="600" color="primary">
                    Voter Age Demographics
                  </Typography>
                  <Box sx={{ height: 250, p: 2 }}>
                    <Pie data={ageDistributionData} options={pieOptions} />
                  </Box>
                </Box>
              )}
              
              {/* Summary Statistics */}
              <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                <Typography variant="subtitle2" align="center" color="text.secondary">
                  Total Votes: <strong>{item.vote.reduce((a, b) => a + b, 0)}</strong>
                  {voterAgeData && (
                    <> • Participating Age Groups: <strong>{Object.values(voterAgeData).filter(v => v > 0).length}</strong></>
                  )}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Collapse>
    </>
  );
};

const ResultElection = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const { getAllTransactions, connectWallet, currentAccount, isMetaMaskInstalled } = useContext(TransactionContext);

  // Get current page items
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentElections = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearch = useCallback((value) => {
    if (!value.trim()) {
      setFilteredData(data);
      return;
    }
    
    const filtered = data.filter(election => 
      election.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data]);
  
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    setPage(1);
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const getData = async () => {
    setLoading(true);
    setRefreshing(true);
    setError(null);
    
    try {
      // Try to connect to wallet first if not connected
      if (!currentAccount && isMetaMaskInstalled) {
        try {
          await connectWallet();
        } catch (walletError) {
          console.error("Error connecting wallet:", walletError);
          // Continue anyway - we'll handle missing wallet later
        }
      }
      
      // Get elections in result phase
      try {
        const electionsResponse = await axios.get(serverLink + "result/elections");
        const resultElections = electionsResponse.data;
        
        if (!resultElections || resultElections.length === 0) {
          setData([]);
          setFilteredData([]);
          setLoading(false);
          setRefreshing(false);
          return;
        }
        
        try {
          // Get all transactions from blockchain
          const transactions = await getAllTransactions();
          
          // Get candidates for mapping
          const candidatesResponse = await axios.get(serverLink + "candidates");
          const candidates = candidatesResponse.data;
          
          // Process blockchain results
          const blockchainResults = await getResult(transactions);
          
          // Prepare combined results including elections without votes
          const combinedResults = [];
          
          // First process elections with blockchain data
          for (const election of resultElections) {
            const matchingResult = blockchainResults.find(r => r.name === election.name);
            
            if (matchingResult) {
              // Election has blockchain data
              combinedResults.push({
                ...election,
                vote: matchingResult.vote,
                candidates: matchingResult.candidates,
                info: matchingResult
              });
            } else {
              // Election doesn't have blockchain data - create placeholder
              const candidateIds = election.candidates || [];
              const candidateNames = [];
              
              // Map candidate IDs to usernames
              for (const candidateId of candidateIds) {
                const candidate = candidates.find(c => c._id === candidateId);
                if (candidate) {
                  candidateNames.push(candidate.username);
                }
              }
              
              combinedResults.push({
                ...election,
                vote: Array(candidateNames.length).fill(0),
                candidates: candidateNames,
                info: {
                  name: election.name,
                  candidates: candidateNames,
                  vote: Array(candidateNames.length).fill(0),
                  noVotes: true
                }
              });
            }
          }
          
          console.log("Combined election results:", combinedResults);
          setData(combinedResults);
          setFilteredData(combinedResults);
        } catch (blockchainError) {
          console.error("Error getting blockchain data:", blockchainError);
          
          // Still show elections even without blockchain data
          const fallbackResults = resultElections.map(election => ({
            ...election,
            vote: [],
            candidates: [],
            info: {
              name: election.name,
              candidates: [],
              vote: [],
              noVotes: true,
              blockchainError: true
            }
          }));
          
          setData(fallbackResults);
          setFilteredData(fallbackResults);
          
          if (!isMetaMaskInstalled) {
            setError("MetaMask is not installed. Please install MetaMask to view blockchain data.");
          } else {
            setError("Could not retrieve blockchain data. Please check your MetaMask connection.");
          }
        }
      } catch (apiError) {
        console.error("API error:", apiError);
        setError("Could not connect to the server. Please check your internet connection.");
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching election data:", error);
      setError("Could not load election results. Please try again later.");
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getData();
  }, [connectWallet]);
  
  useEffect(() => {
    handleSearch(searchValue);
  }, [searchValue, handleSearch]);
  
  const handleRetry = async () => {
    try {
      await connectWallet();
      // Reload data
      getData();
    } catch (error) {
      console.error("Error on retry:", error);
      setError("Still unable to connect to blockchain. Please check your MetaMask connection.");
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Generate random avatar colors based on election name
  const getAvatarColor = (name) => {
    const colors = [
      '#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#ef4444', 
      '#06b6d4', '#ec4899', '#f59e0b', '#6366f1', '#14b8a6'
    ];
    
    // Simple hash function to get consistent color for same name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <Box sx={{ 
      bgcolor: '#f8f9fa',
      minHeight: '100vh',
      pb: 6
    }}>
      {/* Indian Government Style Header */}
      <Box sx={{ 
        background: `linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)`,
        height: '6px'
      }} />
      
      {/* Official Header */}
      <Box sx={{ 
        backgroundColor: '#000080',
        color: 'white',
        py: 1.5,
        textAlign: 'center'
      }}>
        <Container maxWidth="xl">
          <Typography variant="body1" fontWeight="bold">
            भारत निर्वाचन आयोग - Election Commission of India
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            चुनाव परिणाम | Election Results Portal
          </Typography>
        </Container>
      </Box>

      {/* Header */}
      <MainNavbar />
      
      {/* Government Style Breadcrumbs */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 2 }}>
        <Paper sx={{ 
          p: 2, 
          backgroundColor: alpha('#FF9933', 0.05),
          border: `1px solid ${alpha('#FF9933', 0.2)}`
        }}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <MuiLink
              underline="hover"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: '#000080',
                fontWeight: 500
              }}
              component={Link}
              to="/"
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              मुख्य पृष्ठ | Home
            </MuiLink>
            <Typography sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: '#138808',
              fontWeight: 600
            }}>
              <PollIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              चुनाव परिणाम | Election Results
            </Typography>
          </Breadcrumbs>
        </Paper>
      </Container>
      
      <Container maxWidth="xl">
        <Fade in={true} timeout={800}>
          <Box sx={{ py: 3 }}>
            {/* Indian Government Style Header */}
            <Paper sx={{ 
              p: 4, 
              mb: 4,
              background: `linear-gradient(135deg, ${alpha('#FF9933', 0.1)} 0%, ${alpha('#138808', 0.1)} 100%)`,
              border: `2px solid ${alpha('#000080', 0.2)}`,
              borderRadius: 3
            }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h3" fontWeight="bold" sx={{ color: '#000080', mb: 1 }}>
                  📊 चुनाव परिणाम पोर्टल | Election Results Portal
                </Typography>
                <Typography variant="h6" sx={{ color: '#138808', fontWeight: 500 }}>
                  पारदर्शी परिणाम | Transparent Results
                </Typography>
              </Box>
            </Paper>

            {/* Header with search and refresh button */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'stretch', sm: 'center' },
              mb: 4,
              gap: 2
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                width: { xs: '100%', sm: 'auto' }
              }}>
                <Typography variant="h5" fontWeight="700" sx={{ color: '#000080' }}>
                  परिणाम सूची | Results List
                </Typography>
                
                <TextField
                  placeholder="परिणाम खोजें... | Search results..."
                  size="small"
                  value={searchValue}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: '#FF9933' }} />
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: '20px',
                      bgcolor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }
                  }}
                  sx={{ 
                    width: { xs: '100%', sm: '300px' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: alpha('#FF9933', 0.3),
                      },
                      '&:hover fieldset': {
                        borderColor: '#FF9933',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF9933',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </Box>
              
              <Tooltip title="परिणाम रीफ्रेश करें | Refresh Results" arrow>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={getData}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: '#138808',
                    '&:hover': {
                      backgroundColor: alpha('#138808', 0.8),
                    },
                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }}
                >
                  रीफ्रेश | Refresh
                </Button>
              </Tooltip>
            </Box>
            
            {/* Error alert */}
            {error && (
              <Alert 
                severity="warning" 
                sx={{ 
                  mb: 4, 
                  borderRadius: '12px',
                  '& .MuiAlert-icon': {
                    alignItems: 'center'
                  }
                }}
                action={
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={handleRetry}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Retry
                  </Button>
                }
              >
                {error}
              </Alert>
            )}
            
            {/* Results Grid */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <CircularProgress size={60} thickness={4} />
              </Box>
            ) : filteredData.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {currentElections.map((item, index) => (
                    <Grid 
                      item 
                      xs={12} 
                      sm={6} 
                      md={4} 
                      key={index}
                      component={motion.div}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Paper 
                        sx={{ 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                          },
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            backgroundColor: getAvatarColor(item.name),
                          }
                        }}
                      >
                        <Box sx={{ 
                          p: 3, 
                          bgcolor: alpha(getAvatarColor(item.name), 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: getAvatarColor(item.name),
                              boxShadow: `0 4px 12px ${alpha(getAvatarColor(item.name), 0.4)}`
                            }}
                          >
                            <PollIcon />
                          </Avatar>
                          <Typography variant="h6" fontWeight="600" noWrap>
                            {item.name}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ p: 3, flexGrow: 1 }}>
                          <Box sx={{ mb: 2 }}>
                            <Chip 
                              label="Results Available" 
                              color="warning" 
                              size="small" 
                              sx={{ borderRadius: '6px' }}
                            />
                          </Box>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          {item.info && item.info.noVotes ? (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              No votes recorded for this election
                            </Typography>
                          ) : (
                            <>
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" fontWeight="medium" gutterBottom>
                                  Top candidates:
                                </Typography>
                                {item.candidates && item.candidates.slice(0, 2).map((candidate, idx) => (
                                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2">
                                      {candidate}
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                      {item.vote && item.vote[idx]} votes
                                    </Typography>
                                  </Box>
                                ))}
                                {item.candidates && item.candidates.length > 2 && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    +{item.candidates.length - 2} more candidates
                                  </Typography>
                                )}
                              </Box>
                              
                              {/* Add graphs component */}
                              <ElectionCardGraphs item={item} electionInfo={item.info} />
                            </>
                          )}
                        </Box>
                        
                        <Divider />
                        
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                          <Button 
                            variant="contained"
                            component={Link}
                            to={`/result/${item.name}`}
                            state={{ info: item.info }}
                            startIcon={<AssessmentIcon />}
                            sx={{
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              bgcolor: getAvatarColor(item.name),
                              '&:hover': {
                                bgcolor: alpha(getAvatarColor(item.name), 0.9),
                              }
                            }}
                          >
                            View Results
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                
                {/* Pagination */}
                {filteredData.length > itemsPerPage && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    mt: 4 
                  }}>
                    <Pagination 
                      count={Math.ceil(filteredData.length / itemsPerPage)} 
                      page={page} 
                      onChange={handlePageChange}
                      color="primary"
                      shape="rounded"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          borderRadius: '8px',
                        }
                      }}
                    />
                  </Box>
                )}
              </>
            ) : (
              <Paper 
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ 
                  p: 5, 
                  textAlign: 'center',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      margin: '0 auto',
                      mb: 2
                    }}
                  >
                    <PollIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  No Election Results Available
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 3 }}>
                  There are currently no elections in the results phase.
                </Typography>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/elections"
                  startIcon={<HowToVoteIcon />}
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
                  View Active Elections
                </Button>
              </Paper>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default ResultElection;
