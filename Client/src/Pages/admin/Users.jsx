import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Chip, 
  IconButton, 
  Tooltip, 
  Link, 
  Button,
  AppBar,
  Toolbar,
  Breadcrumbs,
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
  useTheme,
  alpha,
  Divider
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Visibility, 
  Add, 
  PeopleAlt, 
  Refresh, 
  Home as HomeIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Check as CheckIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverLink } from '../../Data/Variables';

const Users = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
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
    { value: 'email', label: 'Email' },
    { value: 'fname', label: 'First Name' },
  ];
  
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const response = await axios.get(serverLink + 'users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.get(serverLink + 'user/delete/' + id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
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
  
  // Filter users based on search and filter field
  const filteredUsers = users.filter(user => {
    if (!searchValue) return true;
    
    const value = user[filterField];
    if (typeof value === 'string') {
      return value.toLowerCase().includes(searchValue.toLowerCase());
    }
    return false;
  });
  
  // Get current page items
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  
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
  const getInitials = (user) => {
    if (user.fname && user.lname) {
      return `${user.fname[0]}${user.lname[0]}`.toUpperCase();
    }
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
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
            <PeopleAlt sx={{ mr: 2, color: theme.palette.primary.main }} />
            <Typography variant="h5" fontWeight="bold">
              Users Management
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Refresh Data" arrow>
            <IconButton onClick={fetchUsers} sx={{ 
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
            <PeopleAlt sx={{ mr: 0.5 }} fontSize="inherit" />
            Users
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
                    User List
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
                  onClick={() => navigate('/admin/users/add')}
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
                  Add User
                </Button>
              </Box>
              
              {/* User Cards Grid */}
              {currentUsers.length > 0 ? (
                <Grid container spacing={3}>
                  {currentUsers.map((user) => (
                    <Grid item xs={12} sm={6} md={4} key={user._id}>
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
                          backgroundColor: user.isAdmin ? theme.palette.primary.main : theme.palette.info.main,
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
                              bgcolor: getAvatarColor(user.username),
                              fontSize: '1.75rem',
                              fontWeight: 'bold',
                              boxShadow: `0 4px 12px ${alpha(getAvatarColor(user.username), 0.4)}`
                            }}
                          >
                            {getInitials(user)}
                          </Avatar>
                          
                          <Typography variant="h6" fontWeight="600" gutterBottom>
                            {user.username}
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {user.fname} {user.lname}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 0.5 }}>
                            <EmailIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <Chip 
                              label={user.isAdmin ? 'Admin' : 'User'} 
                              color={user.isAdmin ? 'primary' : 'default'} 
                              size="small"
                              icon={user.isAdmin ? <AdminIcon /> : <PersonIcon />}
                              sx={{ 
                                fontWeight: 500,
                                borderRadius: '16px',
                              }}
                            />
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
                              to={`/admin/users/${user._id}`}
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
                          
                          <Tooltip title="Edit User" arrow>
                            <IconButton 
                              size="small"
                              component={RouterLink}
                              to={`/admin/users/${user._id}/edit`}
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
                          
                          <Tooltip title="Delete User" arrow>
                            <IconButton 
                              size="small"
                              onClick={() => handleDelete(user._id)}
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
                    No users found. {searchValue && 'Try a different search term.'}
                  </Typography>
                  <Button 
                    startIcon={<Refresh />} 
                    onClick={fetchUsers}
                    sx={{ mt: 2 }}
                  >
                    Refresh
                  </Button>
                </Paper>
              )}
              
              {/* Pagination */}
              {filteredUsers.length > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  mt: 4 
                }}>
                  <Pagination 
                    count={Math.ceil(filteredUsers.length / itemsPerPage)} 
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

export default Users; 