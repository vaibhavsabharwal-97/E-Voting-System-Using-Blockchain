import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Chip, 
  IconButton, 
  Tooltip,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link,
  Fade,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  InputAdornment,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  Visibility, 
  HowToVote, 
  Refresh, 
  Home as HomeIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Check as CheckIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Cake as CakeIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverLink } from '../../Data/Variables';

const Candidates = () => {
  const theme = useTheme();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filterField, setFilterField] = useState('username');
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  
  const filterOptions = [
    { value: 'username', label: 'Username' },
    { value: 'firstName', label: 'First Name' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'location', label: 'Location' },
  ];

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const response = await axios.get(serverLink + 'candidates');
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await axios.get(serverLink + 'candidate/delete/' + id);
        fetchCandidates();
      } catch (error) {
        console.error('Error deleting candidate:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    setPage(1);
  };
  
  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setAnchorEl(null);
  };
  
  const handleFilterSelect = (value) => {
    setFilterField(value);
    setPage(1);
    handleFilterClose();
  };
  
  // Filter candidates based on search and filter field
  const filteredCandidates = candidates.filter(candidate => {
    if (!searchValue) return true;
    
    const value = candidate[filterField];
    if (typeof value === 'string') {
      return value.toLowerCase().includes(searchValue.toLowerCase());
    }
    return false;
  });
  
  // Get current page items
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCandidates = filteredCandidates.slice(indexOfFirstItem, indexOfLastItem);
  
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
    if (candidate.firstName && candidate.lastName) {
      return `${candidate.firstName[0]}${candidate.lastName[0]}`.toUpperCase();
    }
    if (candidate.username) {
      return candidate.username.substring(0, 2).toUpperCase();
    }
    return 'C';
  };

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
            <HowToVote sx={{ mr: 2, color: theme.palette.primary.main }} />
            <Typography variant="h5" fontWeight="bold">
              Candidates Management
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Refresh Data" arrow>
            <IconButton onClick={fetchCandidates} sx={{ 
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
            <HowToVote sx={{ mr: 0.5 }} fontSize="inherit" />
            Candidates
          </Typography>
        </Breadcrumbs>
      </Container>

      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Fade in={true} timeout={800}>
            <Box>
              {/* Header with search and add button */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'stretch', sm: 'center' },
                mb: 3,
                gap: 2
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  width: { xs: '100%', sm: 'auto' }
                }}>
                  <Typography variant="h6" fontWeight="600">
                    Candidate List
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      placeholder="Search..."
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
                        width: { xs: '100%', sm: '220px' },
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
                    
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<FilterListIcon />}
                      onClick={handleFilterClick}
                      sx={{ 
                        borderRadius: '20px',
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        color: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          borderColor: theme.palette.primary.main,
                        }
                      }}
                    >
                      {filterOptions.find(option => option.value === filterField)?.label || 'Filter'}
                    </Button>
                    
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleFilterClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      {filterOptions.map((option) => (
                        <MenuItem 
                          key={option.value} 
                          onClick={() => handleFilterSelect(option.value)}
                          selected={filterField === option.value}
                        >
                          {filterField === option.value && (
                            <ListItemIcon>
                              <CheckIcon fontSize="small" />
                            </ListItemIcon>
                          )}
                          <ListItemText 
                            inset={filterField !== option.value}
                            primary={option.label} 
                          />
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Box>
                
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/admin/candidates/add')}
                  sx={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  Add Candidate
                </Button>
              </Box>
              
              {/* Candidate Cards Grid */}
              {currentCandidates.length > 0 ? (
                <Grid container spacing={3}>
                  {currentCandidates.map((candidate) => (
                    <Grid item xs={12} sm={6} md={4} key={candidate._id}>
                      <Card sx={{ 
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
                          backgroundColor: theme.palette.secondary.main,
                        }
                      }}>
                        <CardContent sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          textAlign: 'center',
                          pt: 4,
                          pb: 2,
                          flexGrow: 1
                        }}>
                          <Avatar 
                            sx={{ 
                              width: 80, 
                              height: 80, 
                              mb: 2, 
                              bgcolor: getAvatarColor(candidate.username),
                              fontSize: '1.75rem',
                              fontWeight: 'bold',
                              boxShadow: `0 4px 12px ${alpha(getAvatarColor(candidate.username), 0.4)}`
                            }}
                          >
                            {getInitials(candidate)}
                          </Avatar>
                          
                          <Typography variant="h6" fontWeight="600" gutterBottom>
                            {candidate.username}
                          </Typography>
                          
                          <Typography variant="body1" gutterBottom>
                            {candidate.firstName} {candidate.lastName}
                          </Typography>
                          
                          <Box sx={{ width: '100%', mt: 2 }}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              mb: 1,
                              gap: 1
                            }}>
                              <SchoolIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                              <Typography variant="body2" align="left">
                                {candidate.qualification || 'No qualification listed'}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              mb: 1,
                              gap: 1
                            }}>
                              <LocationIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
                              <Typography variant="body2" align="left">
                                {candidate.location || 'Location not specified'}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <CakeIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />
                              <Typography variant="body2" align="left">
                                {formatDate(candidate.dob) || 'DOB not available'}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                        
                        <Divider />
                        
                        <CardActions sx={{ 
                          display: 'flex', 
                          justifyContent: 'center',
                          p: 1.5
                        }}>
                          <Tooltip title="View Details" arrow>
                            <IconButton 
                              size="small"
                              component={RouterLink}
                              to={`/admin/candidates/${candidate._id}`}
                              sx={{ 
                                color: theme.palette.info.main,
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.info.main, 0.2),
                                }
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Edit Candidate" arrow>
                            <IconButton 
                              size="small"
                              component={RouterLink}
                              to={`/admin/candidates/${candidate._id}/edit`}
                              sx={{ 
                                color: theme.palette.warning.main,
                                bgcolor: alpha(theme.palette.warning.main, 0.1),
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.warning.main, 0.2),
                                }
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Delete Candidate" arrow>
                            <IconButton 
                              size="small"
                              onClick={() => handleDelete(candidate._id)}
                              sx={{ 
                                color: theme.palette.error.main,
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.error.main, 0.2),
                                }
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No candidates found. {searchValue && 'Try a different search term.'}
                  </Typography>
                  <Button 
                    startIcon={<Refresh />} 
                    onClick={fetchCandidates}
                    sx={{ mt: 2 }}
                  >
                    Refresh
                  </Button>
                </Paper>
              )}
              
              {/* Pagination */}
              {filteredCandidates.length > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  mt: 4 
                }}>
                  <Pagination 
                    count={Math.ceil(filteredCandidates.length / itemsPerPage)} 
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
            </Box>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default Candidates; 