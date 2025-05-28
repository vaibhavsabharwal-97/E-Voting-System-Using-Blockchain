import { 
  Grid, 
  Typography, 
  Box, 
  Container, 
  Button, 
  Paper, 
  AppBar,
  Toolbar,
  CircularProgress,
  Fade,
  useTheme,
  alpha,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  Pagination,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
  AlertTitle,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CardLayout from "../Components/User/CardLayout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverLink, isFaceRecognitionEnable, staticFileLink } from "../Data/Variables";
import { useUser } from "../context/UserContext";
import { 
  ArrowBack as ArrowBackIcon,
  HowToVote as HowToVoteIcon,
  Poll as ResultIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CalendarToday,
  People,
  Refresh,
  Visibility,
  Person as PersonIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { motion } from "framer-motion";
import MainNavbar from "../Components/User/MainNavbar";
import VoiceControl from "../Components/VoiceControl";

const Election = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { authenticatedUser, isAuthenticated, authenticateUser } = useUser();

  // Indian flag colors
  const saffron = '#FF9933';
  const white = '#FFFFFF';
  const green = '#138808';
  const navy = '#000080';

  const [elections, setElections] = useState([]);
  const [filteredElections, setFilteredElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [faceRecognitionLoading, setFaceRecognitionLoading] = useState(true);
  const [faceRecognitionError, setFaceRecognitionError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showUserConfirmation, setShowUserConfirmation] = useState(false);
  const [recognizedUser, setRecognizedUser] = useState(null);
  const itemsPerPage = 6;

  useEffect(() => {
    // If already authenticated in context, use that data
    if (isAuthenticated && authenticatedUser) {
      setUserData(authenticatedUser);
      fetchElectionsForUser(authenticatedUser);
    } else if (isFaceRecognitionEnable) {
      setDialogOpen(true);
      performFaceRecognition();
    } else {
      fetchElections();
    }
  }, [isAuthenticated, authenticatedUser]);

  const performFaceRecognition = async () => {
    setFaceRecognitionLoading(true);
    setFaceRecognitionError(null);
    try {
      // Trigger face recognition
      const response = await axios.post(serverLink + "op");
      const userName = response.data;
      
      // Get user data
      const userResponse = await axios.get(serverLink + "user/username/" + userName);
      const user = userResponse.data[0];
      
      if (!user) {
        setFaceRecognitionError("User not found. Please try again.");
        return;
      }
      
      // Instead of immediately setting user data and closing dialog,
      // show confirmation dialog
      setRecognizedUser(user);
      setShowUserConfirmation(true);
      setFaceRecognitionLoading(false);
      
    } catch (error) {
      console.error("Face recognition error:", error);
      setFaceRecognitionError(error.response ? error.response.data : "Face recognition failed. Please try again.");
      setFaceRecognitionLoading(false);
    }
  };

  const handleConfirmUser = async () => {
    try {
      setUserData(recognizedUser);
      authenticateUser(recognizedUser);
      
      // Fetch elections first
      const response = await axios.get(serverLink + "voting/elections");
      const allElections = response.data;
      
      // Filter elections by user's location
      const userLocationElections = allElections.filter(election => 
        election.location === recognizedUser.location || election.location === ""
      );

      if (userLocationElections.length > 0) {
        // Close dialogs
        setDialogOpen(false);
        setShowUserConfirmation(false);
        
        // Redirect to the first election's details page
        navigate(`/elections/${userLocationElections[0]._id}`, { 
          state: { 
            info: userLocationElections[0]
          } 
        });
      } else {
        // If no elections found, just close dialogs
        setDialogOpen(false);
        setShowUserConfirmation(false);
      }
    } catch (error) {
      console.error("Error fetching elections:", error);
      // Close dialogs even if there's an error
      setDialogOpen(false);
      setShowUserConfirmation(false);
    }
  };

  const handleCancelUser = () => {
    setShowUserConfirmation(false);
    setRecognizedUser(null);
    performFaceRecognition(); // Retry face recognition
  };

  const fetchElectionsForUser = async (user) => {
    setLoading(true);
    setRefreshing(true);
    try {
      const response = await axios.get(serverLink + "voting/elections");
      const allElections = response.data;
      
      // Filter elections by user's location
      const userLocationElections = allElections.filter(election => 
        election.location === user.location || election.location === ""
      );
      
      setElections(userLocationElections);
      setFilteredElections(userLocationElections);
    } catch (error) {
      console.error("Error fetching elections:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchElections = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const response = await axios.get(serverLink + "voting/elections");
      setElections(response.data);
      setFilteredElections(response.data);
    } catch (error) {
      console.error("Error fetching elections:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    setPage(1);
    
    if (!value.trim()) {
      setFilteredElections(elections);
      return;
    }
    
    const filtered = elections.filter(election => 
      election.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredElections(filtered);
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const handleRetryFaceRecognition = () => {
    performFaceRecognition();
  };
  
  // Get current page items
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentElections = filteredElections.slice(indexOfFirstItem, indexOfLastItem);
  
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
        background: `linear-gradient(90deg, ${saffron} 0%, ${white} 50%, ${green} 100%)`,
        height: '6px'
      }} />
      
      {/* Official Header */}
      <Box sx={{ 
        backgroundColor: navy,
        color: white,
        py: 1.5,
        textAlign: 'center'
      }}>
        <Container maxWidth="xl">
          <Typography variant="body1" fontWeight="bold">
            भारत निर्वाचन आयोग - Election Commission of India
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            चालू चुनाव | Active Elections Portal
          </Typography>
        </Container>
      </Box>
      
      <MainNavbar />

      {/* Face Recognition Dialog */}
      <Dialog 
        open={dialogOpen} 
        fullWidth 
        maxWidth="sm"
        disableEscapeKeyDown
        disableBackdropClick
        PaperProps={{
          sx: {
            border: `2px solid ${saffron}`,
            borderRadius: 3
          }
        }}
      >
        {showUserConfirmation ? (
          <>
            <DialogTitle sx={{ 
              textAlign: 'center',
              backgroundColor: alpha(saffron, 0.1),
              color: navy,
              fontWeight: 'bold'
            }}>
              🔍 पहचान की पुष्टि करें | Confirm Your Identity
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: alpha(green, 0.02) }}>
              {/* Voice Control for Identity Confirmation */}
              <VoiceControl 
                step="confirm" 
                autoPlay={true} 
                variant="inline" 
                showLabel={true}
              />
              
              <Box sx={{ py: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  mb: 3
                }}>
                  <Avatar
                    src={`${staticFileLink}Faces/${recognizedUser?.username}.jpg`}
                    alt={recognizedUser?.fname}
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 2,
                      border: `4px solid ${saffron}`,
                    }}
                  >
                    {recognizedUser?.fname?.charAt(0)}
                  </Avatar>
                  <Typography variant="subtitle1" gutterBottom fontWeight="500" align="center" sx={{ color: navy }}>
                    क्या यह आप हैं? | Is this you?
                  </Typography>
                </Box>
                <Paper sx={{ 
                  p: 2, 
                  backgroundColor: white,
                  border: `1px solid ${alpha(saffron, 0.3)}`,
                  borderRadius: 2
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 1 }}>
                        <Typography color="textSecondary" variant="body2">नाम | First Name</Typography>
                        <Typography sx={{ color: navy, fontWeight: 500 }}>{recognizedUser?.fname}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 1 }}>
                        <Typography color="textSecondary" variant="body2">उपनाम | Last Name</Typography>
                        <Typography sx={{ color: navy, fontWeight: 500 }}>{recognizedUser?.lname}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 1 }}>
                        <Typography color="textSecondary" variant="body2">मतदाता पहचान | Voter ID</Typography>
                        <Typography sx={{ color: green, fontWeight: 600 }}>{recognizedUser?.voterID}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 1 }}>
                        <Typography color="textSecondary" variant="body2">स्थान | Location</Typography>
                        <Typography sx={{ color: navy, fontWeight: 500 }}>{recognizedUser?.location}</Typography>
                      </Box>
                    </Grid>
                    {recognizedUser?.mobile && (
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1 }}>
                          <Typography color="textSecondary" variant="body2">मोबाइल | Mobile</Typography>
                          <Typography sx={{ color: navy, fontWeight: 500 }}>{recognizedUser.mobile}</Typography>
                        </Box>
                      </Grid>
                    )}
                    {recognizedUser?.email && (
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1 }}>
                          <Typography color="textSecondary" variant="body2">ईमेल | Email</Typography>
                          <Typography sx={{ color: navy, fontWeight: 500 }}>{recognizedUser.email}</Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center', gap: 2 }}>
              <Button 
                onClick={handleCancelUser}
                variant="outlined"
                sx={{ 
                  minWidth: 120,
                  borderColor: '#e53e3e',
                  color: '#e53e3e',
                  '&:hover': {
                    borderColor: '#e53e3e',
                    backgroundColor: alpha('#e53e3e', 0.1)
                  }
                }}
              >
                मैं नहीं | Not Me
              </Button>
              <Button 
                onClick={handleConfirmUser}
                variant="contained"
                sx={{ 
                  minWidth: 120,
                  backgroundColor: green,
                  '&:hover': {
                    backgroundColor: alpha(green, 0.8)
                  }
                }}
              >
                पुष्टि करें | Confirm
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle sx={{ 
              textAlign: 'center',
              backgroundColor: alpha(navy, 0.1),
              color: navy,
              fontWeight: 'bold'
            }}>
              📷 चेहरा पहचान | Face Recognition
            </DialogTitle>
            <DialogContent>
              {/* Voice Control for Camera Step */}
              <VoiceControl 
                step="camera" 
                autoPlay={true} 
                variant="inline" 
                showLabel={true}
              />
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                py: 3 
              }}>
                {faceRecognitionLoading ? (
                  <>
                    <CircularProgress 
                      size={60} 
                      thickness={4} 
                      sx={{ 
                        mb: 3,
                        color: saffron
                      }} 
                    />
                    <Typography variant="body1" gutterBottom sx={{ color: navy, fontWeight: 500 }}>
                      कृपया कैमरे की ओर देखें | Please look at the camera
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      चेहरा पहचान के लिए कैमरा विंडो खुलेगी | A camera window will open for face recognition
                    </Typography>
                  </>
                ) : faceRecognitionError ? (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 2,
                        '& .MuiAlert-icon': {
                          color: '#e53e3e'
                        }
                      }}
                    >
                      {faceRecognitionError}
                    </Alert>
                    <Button 
                      variant="contained" 
                      onClick={handleRetryFaceRecognition}
                      fullWidth
                      sx={{
                        backgroundColor: saffron,
                        '&:hover': {
                          backgroundColor: alpha(saffron, 0.8)
                        }
                      }}
                    >
                      पुनः प्रयास | Retry Face Recognition
                    </Button>
                  </Box>
                ) : null}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
      
      {/* Government Style Breadcrumbs */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 2 }}>
        <Paper sx={{ 
          p: 2, 
          backgroundColor: alpha(saffron, 0.05),
          border: `1px solid ${alpha(saffron, 0.2)}`
        }}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <MuiLink
              underline="hover"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: navy,
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
              color: green,
              fontWeight: 600
            }}>
              <HowToVoteIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              चालू चुनाव | Active Elections
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
              background: `linear-gradient(135deg, ${alpha(saffron, 0.1)} 0%, ${alpha(green, 0.1)} 100%)`,
              border: `2px solid ${alpha(navy, 0.2)}`,
              borderRadius: 3
            }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h3" fontWeight="bold" sx={{ color: navy, mb: 1 }}>
                  🗳️ चुनाव पोर्टल | Elections Portal
                </Typography>
                <Typography variant="h6" sx={{ color: green, fontWeight: 500 }}>
                  लोकतंत्र में भागीदारी करें | Participate in Democracy
                </Typography>
              </Box>
              
              {userData && (
                <Box sx={{ 
                  backgroundColor: white,
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${alpha(green, 0.3)}`,
                  mb: 3
                }}>
                  <Typography variant="body1" sx={{ color: navy, fontWeight: 600, mb: 1 }}>
                    स्वागत | Welcome: {userData.fname} {userData.lname}
                  </Typography>
                  <Typography variant="body2" sx={{ color: green }}>
                    📍 स्थान | Location: {userData.location} | 🆔 Voter ID: {userData.voterID}
                  </Typography>
                </Box>
              )}
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
                <Typography variant="h5" fontWeight="700" sx={{ color: theme.palette.primary.main }}>
                  Active Elections
                </Typography>
                
                {userData && (
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <Chip
                      icon={<PersonIcon />} 
                      label={userData.username}
                      color="primary"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      icon={<LocationIcon />}
                      label={userData.location} 
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                )}
                
                <TextField
                  placeholder="Search elections..."
                  size="small"
                  value={searchValue}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: '20px',
                      bgcolor: theme.palette.background.paper,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }
                  }}
                  sx={{ 
                    width: { xs: '100%', sm: '250px' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Box>
              
              <Tooltip title="Refresh Elections" arrow>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => userData ? fetchElectionsForUser(userData) : fetchElections()}
                  sx={{
                    borderRadius: '8px',
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    },
                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }}
                >
                  Refresh
                </Button>
              </Tooltip>
            </Box>
            
            {/* Elections Grid */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <CircularProgress size={60} thickness={4} />
              </Box>
            ) : filteredElections.length === 0 ? (
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
                    <HowToVoteIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  No Active Elections
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 3 }}>
                  {userData 
                    ? `There are currently no active elections for your location (${userData.location}).`
                    : 'There are currently no elections in the voting phase.'}
                </Typography>
              </Paper>
            ) : (
              <>
                <Grid container spacing={3}>
                  {currentElections.map((election, index) => (
                    <Grid item xs={12} sm={6} md={4} key={election._id}>
                      <Card 
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
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
                            backgroundColor: getAvatarColor(election.name),
                          }
                        }}
                      >
                        <Box sx={{ 
                          p: 3, 
                          bgcolor: alpha(getAvatarColor(election.name), 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: getAvatarColor(election.name),
                              boxShadow: `0 4px 12px ${alpha(getAvatarColor(election.name), 0.4)}`
                            }}
                          >
                            <HowToVoteIcon />
                          </Avatar>
                          <Typography variant="h6" fontWeight="600" noWrap>
                            {election.name}
                          </Typography>
                        </Box>
                        
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Chip 
                              label="Voting Active" 
                              color="success" 
                              size="small" 
                              sx={{ borderRadius: '6px' }}
                            />
                            
                            {election.location && (
                              <Chip 
                                icon={<LocationIcon fontSize="small" />}
                                label={election.location} 
                                size="small" 
                                color="primary"
                                variant="outlined"
                                sx={{ ml: 1, borderRadius: '6px' }}
                              />
                            )}
                          </Box>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <People sx={{ fontSize: 20, color: theme.palette.primary.main, mr: 1 }} />
                            <Typography variant="body2">
                              {election.candidates ? election.candidates.length : 0} Candidates
                            </Typography>
                          </Box>
                          
                          {election.createdAt && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarToday sx={{ fontSize: 20, color: theme.palette.secondary.main, mr: 1 }} />
                              <Typography variant="body2">
                                Created: {new Date(election.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                        
                        <Divider />
                        
                        <CardActions sx={{ p: 2, justifyContent: 'center' }}>
                          <Button 
                            variant="contained"
                            component={Link}
                            to={`/elections/${election._id}`}
                            state={{ info: election }}
                            startIcon={<Visibility />}
                            sx={{
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              bgcolor: getAvatarColor(election.name),
                              '&:hover': {
                                bgcolor: alpha(getAvatarColor(election.name), 0.9),
                              }
                            }}
                          >
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                {/* Pagination */}
                {filteredElections.length > itemsPerPage && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    mt: 4 
                  }}>
                    <Pagination 
                      count={Math.ceil(filteredElections.length / itemsPerPage)} 
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
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Election;
