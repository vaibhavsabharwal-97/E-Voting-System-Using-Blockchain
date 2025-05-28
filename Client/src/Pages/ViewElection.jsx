import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Grid, 
  Typography, 
  Box, 
  Container, 
  Button, 
  CircularProgress, 
  Paper, 
  Card,
  CardContent,
  Divider,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
  alpha,
  Fade,
  Avatar,
  Tooltip,
  IconButton,
  Stack,
  Alert,
  AlertTitle
} from "@mui/material";
import CandidateLayout from "../Components/User/CandidateLayout";
import axios from "axios";
import { serverLink } from "../Data/Variables";
import { useUser } from "../context/UserContext";
import { 
  HowToVote as HowToVoteIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  CalendarToday,
  Info as InfoIcon,
  AccessTime as TimeIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { motion } from "framer-motion";
import MainNavbar from "../Components/User/MainNavbar";
import VoiceControl from "../Components/VoiceControl";

const MotionPaper = motion(Paper);
const MotionTypography = motion(Typography);

const ViewElection = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { authenticatedUser, isAuthenticated } = useUser();

  const getData = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      let link = serverLink + "election/" + id;
      let res = await axios.get(link);
      let election = res.data;
      setData(election);
      setError(null);
    } catch (err) {
      console.error("Error fetching election data:", err);
      setError("Failed to load election data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);
  
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
      bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)',
      minHeight: '100vh',
      pb: 6
    }}>
      {/* Header */}
      <MainNavbar />

      {/* Identity Verification Banner */}
      {isAuthenticated && authenticatedUser && (
        <Alert 
          severity="success" 
          icon={<CheckCircleIcon fontSize="inherit" />}
          sx={{ 
            borderRadius: 0,
            py: 0.5
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Your identity has been verified
            </Typography>
            <Chip
              size="small"
              icon={<PersonIcon sx={{ fontSize: '0.8rem !important' }} />}
              label={authenticatedUser.username}
              color="primary"
              variant="outlined"
              sx={{ mr: 1 }}
            />
            {authenticatedUser.location && (
              <Chip
                size="small"
                icon={<LocationIcon sx={{ fontSize: '0.8rem !important' }} />}
                label={authenticatedUser.location}
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>
        </Alert>
      )}
      
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
            to="/elections"
          >
            <HowToVoteIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Elections
          </MuiLink>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            {data.name || 'Election Details'}
          </Typography>
        </Breadcrumbs>
      </Container>
      
      <Container maxWidth="xl">
        <Fade in={true} timeout={800}>
          <Box sx={{ py: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' },
              mb: 4,
              gap: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<ArrowBackIcon />} 
                  onClick={() => navigate('/elections')}
                  sx={{ 
                    mr: 2,
                    borderRadius: '8px',
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    }
                  }}
                >
                  Back
                </Button>
                <Typography variant="h5" fontWeight="700" sx={{ color: theme.palette.primary.main }}>
                  {data.name || 'Election Details'}
                </Typography>
              </Box>
              
              <Tooltip title="Refresh Election Data">
                <IconButton
                  onClick={getData}
                  disabled={loading || refreshing}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    },
                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }}
                >
                  <RefreshIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Box>
            
            {error && (
              <MotionPaper 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ 
                  p: 3, 
                  mb: 4, 
                  bgcolor: alpha(theme.palette.error.main, 0.05),
                  borderRadius: '16px',
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.2), color: theme.palette.error.main }}>
                  <ErrorIcon />
                </Avatar>
                <Box>
                  <Typography fontWeight="bold" color="error" gutterBottom>
                    Error Loading Election
                  </Typography>
                  <Typography color="error.dark">{error}</Typography>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={getData}
                    startIcon={<RefreshIcon />}
                    sx={{ mt: 1 }}
                  >
                    Try Again
                  </Button>
                </Box>
              </MotionPaper>
            )}
            
            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '300px',
                flexDirection: 'column',
                gap: 2
              }}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="body1" color="text.secondary">
                  Loading election details...
                </Typography>
              </Box>
            ) : (
              <>
                <MotionPaper 
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  sx={{ 
                    p: 4, 
                    mb: 4, 
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: `linear-gradient(90deg, ${data.name ? getAvatarColor(data.name) : theme.palette.primary.main} 0%, ${alpha(data.name ? getAvatarColor(data.name) : theme.palette.primary.main, 0.2)} 100%)`,
                    }
                  }}
                >
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        flexDirection: 'column',
                        justifyContent: 'center',
                        mb: 2,
                        width: '100%'
                      }}>
                        <Box sx={{ width: '100%', textAlign: 'center' }}>
                          <MotionTypography 
                            variant="h4" 
                            fontWeight="bold" 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            sx={{ textAlign: 'center' }}
                          >
                            {data.name || "Election"}
                          </MotionTypography>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                            <Chip 
                              label={`Phase: ${data.currentPhase || 'Voting'}`} 
                              color="primary" 
                              size="small"
                              icon={<HowToVoteIcon />}
                              sx={{ 
                                borderRadius: '8px',
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                                fontWeight: 'bold'
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 2,
                          color: alpha(theme.palette.text.primary, 0.8),
                          textAlign: 'center'
                        }}
                      >
                        {data.description || "Cast your vote for your preferred candidate in this election."}
                      </Typography>
                      
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 1.5,
                          mb: 3,
                          justifyContent: 'center'
                        }}
                      >
                        {data.startDate && (
                          <Chip 
                            label={`Started: ${new Date(data.startDate).toLocaleDateString()}`} 
                            variant="outlined" 
                            icon={<CalendarToday fontSize="small" />}
                            sx={{ borderRadius: '8px' }}
                          />
                        )}
                        {data.endDate && (
                          <Chip 
                            label={`Ends: ${new Date(data.endDate).toLocaleDateString()}`} 
                            variant="outlined" 
                            icon={<TimeIcon fontSize="small" />}
                            sx={{ borderRadius: '8px' }}
                          />
                        )}
                        {data.candidates && (
                          <Chip 
                            label={`Candidates: ${data.candidates.length}`} 
                            variant="outlined" 
                            icon={<PeopleIcon />}
                            sx={{ borderRadius: '8px' }}
                          />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </MotionPaper>
                
                <Box 
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 0,
                    mb: 0
                  }}
                >
                  <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" fontWeight="bold">
                    Candidates
                  </Typography>
                  {data.candidates && (
                    <Chip 
                      label={`${data.candidates.length} candidates`} 
                      size="small" 
                      sx={{ ml: 2, borderRadius: '8px' }} 
                      color="primary" 
                      variant="outlined"
                    />
                  )}
                </Box>
                
                {data.candidates && data.candidates.length > 0 ? (
                  <Box sx={{ mt: 1 }}>
                    <Grid container spacing={1}>
                      {data.candidates.map((item, index) => (
                        <Grid 
                          item 
                          xs={12}
                          key={index}
                          component={motion.div}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                          sx={{ mb: 1 }}
                        >
                          <CandidateLayout
                            username={item}
                            index={index}
                            id={data._id}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ) : (
                  <MotionPaper 
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    sx={{ 
                      p: 5, 
                      textAlign: 'center',
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.7)})`,
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Box sx={{ mb: 3 }}>
                      <Avatar 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          color: theme.palette.warning.main,
                          margin: '0 auto',
                          mb: 2
                        }}
                      >
                        <PeopleIcon sx={{ fontSize: 40 }} />
                      </Avatar>
                    </Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      No Candidates Found
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                      There are no candidates registered for this election.
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<HomeIcon />}
                      onClick={() => navigate('/')}
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
                      Return to Home
                    </Button>
                  </MotionPaper>
                )}
              </>
            )}
          </Box>
        </Fade>
      </Container>
      
      {/* Floating Voice Control */}
      <VoiceControl 
        step="vote" 
        autoPlay={true} 
        variant="floating" 
        showLabel={true}
      />
    </Box>
  );
};

export default ViewElection;