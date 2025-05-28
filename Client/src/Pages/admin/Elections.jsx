import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Chip, 
  IconButton, 
  Tooltip, 
  Grid, 
  Card, 
  CardContent, 
  Divider, 
  Alert, 
  Snackbar,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link,
  Fade,
  Paper,
  useTheme,
  alpha,
  InputAdornment,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Pagination
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  Visibility, 
  FilterList as FilterListIcon,
  Check as CheckIcon,
  Search as SearchIcon,
  Refresh,
  Home as HomeIcon,
  HowToVote,
  CalendarToday,
  People
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { serverLink } from '../../Data/Variables';
import ElectionCard from '../../Components/Admin/ElectionCard';
import ElectionFilter from '../../Components/Admin/ElectionFilter';
import Loader from '../../Components/UI/Loader';

const Elections = () => {
  const theme = useTheme();
  const [elections, setElections] = useState([]);
  const [filteredElections, setFilteredElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [filterField, setFilterField] = useState('name');
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const location = useLocation();

  const filterOptions = [
    { value: 'name', label: 'Election Name' },
    { value: 'currentPhase', label: 'Phase' },
  ];

  // Check for success message in location state (from redirect)
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Clean up the location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchElections = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const response = await axios.get(serverLink + 'elections');
      setElections(response.data);
      setFilteredElections(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching elections:', err);
      setError('Failed to load elections. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilters(newFilter, searchValue, filterField);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    setPage(1);
    applyFilters(filter, value, filterField);
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
    applyFilters(filter, searchValue, value);
    handleFilterClose();
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const applyFilters = (phaseFilter, search, field) => {
    let result = [...elections];
    
    // Apply phase filter
    if (phaseFilter !== 'all') {
      result = result.filter(election => election.currentPhase === phaseFilter);
    }
    
    // Apply search filter
    if (search) {
      result = result.filter(election => {
        const value = election[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(search.toLowerCase());
        }
        return false;
      });
    }
    
    setFilteredElections(result);
  };

  const handleRefresh = () => {
    fetchElections();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this election?')) {
      try {
        await axios.get(serverLink + 'election/delete/' + id);
        fetchElections();
      } catch (error) {
        console.error('Error deleting election:', error);
      }
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'init':
        return 'info';
      case 'voting':
        return 'success';
      case 'result':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  // Get current page items
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentElections = filteredElections.slice(indexOfFirstItem, indexOfLastItem);

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
              Elections Management
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Refresh Data" arrow>
            <IconButton onClick={handleRefresh} sx={{ 
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
            Elections
          </Typography>
        </Breadcrumbs>
      </Container>
      
      <Container maxWidth="lg">
        <Fade in={true} timeout={800}>
          <Box sx={{ py: 3 }}>
            {/* Success message from redirect */}
            <Snackbar
              open={!!successMessage}
              autoHideDuration={6000}
              onClose={() => setSuccessMessage('')}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert 
                onClose={() => setSuccessMessage('')} 
                severity="success" 
                variant="filled"
                sx={{ width: '100%' }}
              >
                {successMessage}
              </Alert>
            </Snackbar>
            
            {/* Error alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            
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
                  Election List
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
                onClick={() => navigate('/admin/elections/add')}
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
                Create Election
              </Button>
            </Box>
            
            {/* Filters */}
            <Card sx={{ 
              mb: 4,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}>
              <CardContent>
                <ElectionFilter 
                  currentFilter={filter}
                  onFilterChange={handleFilterChange}
                  onRefresh={handleRefresh}
                  isLoading={loading}
                />
              </CardContent>
            </Card>
            
            {/* Elections grid */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                <Loader size={60} />
              </Box>
            ) : (
              <>
                {filteredElections.length === 0 ? (
                  <Paper
                    sx={{ 
                      p: 4, 
                      textAlign: 'center',
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    }}
                  >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No elections found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {filter === 'all' 
                        ? 'There are no elections created yet. Click "Create Election" to add one.'
                        : `There are no elections in the "${filter}" phase. Try changing the filter.`}
                    </Typography>
                    <Button 
                      startIcon={<Refresh />} 
                      onClick={handleRefresh}
                      sx={{ mt: 2 }}
                    >
                      Refresh
                    </Button>
                  </Paper>
                ) : (
                  <Grid container spacing={3}>
                    {currentElections.map((election) => (
                      <Grid item xs={12} sm={6} md={4} key={election._id}>
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
                            backgroundColor: 
                              election.currentPhase === 'init' ? theme.palette.info.main :
                              election.currentPhase === 'voting' ? theme.palette.success.main :
                              theme.palette.warning.main,
                          }
                        }}>
                          <CardContent sx={{ p: 3, flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Typography variant="h6" fontWeight="600" gutterBottom noWrap>
                                {election.name}
                              </Typography>
                              <Chip 
                                label={election.currentPhase.charAt(0).toUpperCase() + election.currentPhase.slice(1)} 
                                color={getPhaseColor(election.currentPhase)} 
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                              <People sx={{ fontSize: 20, color: theme.palette.primary.main, mr: 1 }} />
                              <Typography variant="body2">
                                {election.candidates ? election.candidates.length : 0} Candidates
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarToday sx={{ fontSize: 20, color: theme.palette.secondary.main, mr: 1 }} />
                              <Typography variant="body2">
                                Created: {new Date(election.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </CardContent>
                          
                          <Divider />
                          
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-around',
                            p: 1.5
                          }}>
                            <Tooltip title="View Election" arrow>
                              <IconButton 
                                size="small"
                                component={RouterLink}
                                to={`/admin/elections/${election._id}`}
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
                            
                            <Tooltip title="Edit Election" arrow>
                              <IconButton 
                                size="small"
                                component={RouterLink}
                                to={`/admin/elections/${election._id}/edit`}
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
                            
                            <Tooltip title="Delete Election" arrow>
                              <IconButton 
                                size="small"
                                onClick={() => handleDelete(election._id)}
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
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
                
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

export default Elections; 