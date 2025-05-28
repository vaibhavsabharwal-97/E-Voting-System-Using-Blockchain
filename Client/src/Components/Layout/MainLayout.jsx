import React, { useState, useContext, useMemo, useEffect } from 'react';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  Chip,
  useScrollTrigger,
  Container
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SidebarData, UserSidebarData, WebsiteDetails } from '../../Data/SidebarData';
import { ThemeContext } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

// Indian flag colors
const saffron = '#FF9933';
const white = '#FFFFFF';
const green = '#138808';
const navy = '#000080';

const drawerWidth = 260;

const MotionBox = motion(Box);
const MotionDrawer = motion(Drawer);
const MotionListItem = motion(ListItem);

// Hide on scroll
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: trigger ? -100 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    marginTop: '72px',
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

// Updated AppBar with Indian government styling
const GlassMorphicAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderBottom: 'none',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)',
  color: 'white',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${saffron} 0%, ${white} 50%, ${green} 100%)`,
  }
}));

const LogoText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(90deg, #ffffff 0%, #f1f5f9 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
  letterSpacing: '0.5px',
}));

const LogoSubText = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '0.7rem',
  fontWeight: 500,
  letterSpacing: '1px',
  marginTop: '-4px',
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#10b981',
    color: '#10b981',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const MainLayout = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationEl, setNotificationEl] = useState(null);
  const [notifications] = useState(3); // Demo notification count
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleColorMode, mode } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);

  // Determine which sidebar data to use based on the current path
  const isAdmin = location.pathname.startsWith('/admin');
  const navItems = useMemo(() => isAdmin ? SidebarData : UserSidebarData, [isAdmin]);
  
  const pageTitle = useMemo(() => {
    // Extract the current page title from the path
    const path = location.pathname.split('/').filter(Boolean);
    const pageName = path.length > 1 ? path[path.length - 1] : (isAdmin ? 'dashboard' : 'home');
    return pageName.charAt(0).toUpperCase() + pageName.slice(1);
  }, [location.pathname, isAdmin]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenu = (event) => {
    setNotificationEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationEl(null);
  };

  const handleLogout = () => {
    // Close the menu
    handleClose();
    
    // Navigate to the logout route
    navigate('/admin/logout');
  };

  const renderLogo = () => {
    return (
      <Box 
        component={Link}
        to={isAdmin ? "/admin/dashboard" : "/app"}
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none'
        }}
      >
        <Box 
          sx={{ 
            mr: { xs: 0, sm: 1.5 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: !open ? (theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(45, 55, 179, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(45, 55, 179, 0.05) 100%)')
              : alpha('#ffffff', 0.15),
            width: 35,
            height: 35,
            borderRadius: !open ? '12px' : '10px',
            boxShadow: !open ? '0 4px 12px rgba(0, 0, 0, 0.06)' : 'none',
            backdropFilter: open ? 'blur(4px)' : 'none',
            border: !open ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : 'none',
          }}
        >
          {/* Indian Government Emblem Style Icon */}
          <Box sx={{ color: !open ? theme.palette.primary.main : "white", fontSize: 20 }}>
            🏛️
          </Box>
        </Box>
        {!open && (
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <LogoText variant="h6" sx={{ fontSize: '1.2rem', color: theme.palette.primary.main }}>
              {isAdmin ? 'ई-मतदान प्रशासन' : WebsiteDetails.shortTitle}
            </LogoText>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Indian Government Style Header Strip */}
      <Box sx={{ 
        background: `linear-gradient(90deg, ${saffron} 0%, ${white} 50%, ${green} 100%)`,
        height: '4px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1301
      }} />

      <HideOnScroll>
        <GlassMorphicAppBar position="fixed" open={open} sx={{ top: '4px' }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ py: 1 }}>
              {/* Logo when drawer is closed */}
              {!open && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ marginRight: 16 }}
                >
                  {renderLogo()}
                </motion.div>
              )}

              {/* Menu button */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ 
                  mr: 2, 
                  color: 'white',
                  ...(open && { display: 'none' }),
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>

              {/* Title when drawer is open */}
              {open && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Box 
                    sx={{ 
                      mr: 1.5,
                      display: { xs: 'none', sm: 'flex' },
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: alpha('#ffffff', 0.15),
                      width: 35,
                      height: 35,
                      borderRadius: '10px',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    <Box sx={{ color: 'white', fontSize: 20 }}>🏛️</Box>
                  </Box>
                  <Box>
                    <Typography 
                      variant="h6" 
                      component="div" 
                      sx={{ 
                        fontWeight: 700,
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        letterSpacing: '0.5px',
                        color: 'white'
                      }}
                    >
                      {isAdmin ? 'ई-मतदान प्रशासन | E-Vote Admin' : pageTitle}
                    </Typography>
                    {isAdmin && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '11px'
                        }}
                      >
                        भारत निर्वाचन आयोग | Election Commission of India
                      </Typography>
                    )}
                  </Box>
                </motion.div>
              )}

              {/* Spacer */}
              <Box sx={{ flexGrow: 1 }} />

              {/* Right side actions */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Theme toggle */}
                <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                  <IconButton 
                    onClick={toggleColorMode} 
                    sx={{ 
                      color: 'white',
                      mr: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                  </IconButton>
                </Tooltip>

                {/* Notifications */}
                <Tooltip title="Notifications">
                  <IconButton
                    onClick={handleNotificationMenu}
                    sx={{ 
                      color: 'white',
                      mr: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    <StyledBadge badgeContent={notifications} color="error">
                      <NotificationsIcon />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>

                {/* User menu */}
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleMenu}
                    sx={{ 
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: '#10b981',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      A
                    </Avatar>
                  </IconButton>
                </Tooltip>

                {/* User menu dropdown */}
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  sx={{ mt: 1 }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">प्रशासक | Admin User</Typography>
                    <Typography variant="body2" color="text.secondary">admin@eci.gov.in</Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
                    प्रोफ़ाइल | Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon><ChevronRightIcon fontSize="small" /></ListItemIcon>
                    लॉगआउट | Logout
                  </MenuItem>
                </Menu>

                {/* Notification menu */}
                <Menu
                  id="notification-menu"
                  anchorEl={notificationEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(notificationEl)}
                  onClose={handleNotificationClose}
                  sx={{ mt: 1 }}
                >
                  <Box sx={{ px: 2, py: 1, minWidth: 250 }}>
                    <Typography variant="subtitle1" fontWeight="bold">सूचनाएं | Notifications</Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleNotificationClose}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">नया चुनाव बनाया गया | New Election Created</Typography>
                      <Typography variant="caption" color="text.secondary">2 minutes ago</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={handleNotificationClose}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">उम्मीदवार जोड़ा गया | Candidate Added</Typography>
                      <Typography variant="caption" color="text.secondary">5 minutes ago</Typography>
                    </Box>
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </GlassMorphicAppBar>
      </HideOnScroll>

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(180deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)'
              : 'linear-gradient(180deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)',
            top: '4px', // Account for tricolor strip
            height: 'calc(100% - 4px)', // Adjust height
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <AnimatePresence>
          <MotionBox
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <DrawerHeader>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Box 
                  sx={{ 
                    mr: 1.5,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: alpha('#ffffff', 0.15),
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <Box sx={{ color: 'white', fontSize: 22 }}>🏛️</Box>
                </Box>
                <Box>
                  <LogoText variant="h6">
                    {isAdmin ? 'ई-मतदान प्रशासन' : WebsiteDetails.shortTitle}
                  </LogoText>
                  <LogoSubText>
                    {isAdmin ? 'ELECTION ADMIN' : 'BLOCKCHAIN'}
                  </LogoSubText>
                </Box>
              </motion.div>
              <IconButton onClick={handleDrawerClose} sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </DrawerHeader>
            
            <Box sx={{ px: 2, py: 3 }}>
              <List>
                {navItems.map((item, index) => (
                  <MotionListItem
                    key={index} 
                    disablePadding
                    component={Link}
                    to={item.link}
                    sx={{
                      mb: 1,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: (location.pathname === item.link || 
                              (item.link === '/admin' && location.pathname === '/admin/dashboard')) ?
                        theme.palette.mode === 'dark' 
                          ? 'linear-gradient(90deg, rgba(79, 70, 229, 0.2) 0%, rgba(45, 55, 179, 0.1) 100%)'
                          : 'linear-gradient(90deg, rgba(79, 70, 229, 0.15) 0%, rgba(45, 55, 179, 0.05) 100%)'
                        : 'transparent',
                      color: (location.pathname === item.link || 
                             (item.link === '/admin' && location.pathname === '/admin/dashboard')) ?
                        theme.palette.primary.main : theme.palette.text.primary,
                      '&:hover': {
                        background: theme.palette.mode === 'dark' 
                          ? 'linear-gradient(90deg, rgba(79, 70, 229, 0.15) 0%, rgba(45, 55, 179, 0.05) 100%)'
                          : 'linear-gradient(90deg, rgba(79, 70, 229, 0.1) 0%, rgba(45, 55, 179, 0.02) 100%)',
                      },
                      boxShadow: (location.pathname === item.link || 
                              (item.link === '/admin' && location.pathname === '/admin/dashboard')) ?
                        '0 4px 12px rgba(0, 0, 0, 0.05)' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <ListItemButton sx={{ py: 1.5 }}>
                      <ListItemIcon sx={{ 
                        color: (location.pathname === item.link || 
                               (item.link === '/admin' && location.pathname === '/admin/dashboard')) ? 
                          '#4f46e5' : theme.palette.mode === 'dark' ? '#a1a1aa' : '#71717a',
                        minWidth: 46,
                        transition: 'color 0.3s ease',
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.title} 
                        primaryTypographyProps={{
                          fontWeight: (location.pathname === item.link || 
                                     (item.link === '/admin' && location.pathname === '/admin/dashboard')) ? 
                            600 : 400,
                          fontSize: '0.95rem',
                        }}
                      />
                      {(location.pathname === item.link || 
                       (item.link === '/admin' && location.pathname === '/admin/dashboard')) && (
                        <Box
                          component={motion.div}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          sx={{ 
                            ml: 1, 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            background: 'linear-gradient(to right, #4f46e5, #6366f1)',
                            boxShadow: '0 0 8px rgba(99, 102, 241, 0.6)',
                          }} 
                        />
                      )}
                    </ListItemButton>
                  </MotionListItem>
                ))}
              </List>
            </Box>
            
            {/* Footer with version and motto */}
            <Box sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              p: 2, 
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: theme.palette.mode === 'dark' 
                ? 'rgba(17, 24, 39, 0.8)'
                : 'rgba(248, 250, 252, 0.8)',
              backdropFilter: 'blur(10px)',
            }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="caption" sx={{ 
                  color: saffron, 
                  fontWeight: 'bold',
                  display: 'block',
                  mb: 0.5
                }}>
                  सत्यमेव जयते
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: theme.palette.text.secondary,
                  fontSize: '0.7rem'
                }}>
                  Truth Alone Triumphs
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Chip
                  label={`v${WebsiteDetails.version || '1.2.0'}`}
                  size="small"
                  sx={{ 
                    borderRadius: '10px',
                    background: theme.palette.mode === 'dark' 
                      ? 'linear-gradient(90deg, rgba(79, 70, 229, 0.2) 0%, rgba(45, 55, 179, 0.1) 100%)'
                      : 'linear-gradient(90deg, rgba(79, 70, 229, 0.15) 0%, rgba(45, 55, 179, 0.05) 100%)',
                    color: theme.palette.primary.main,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>
          </MotionBox>
        </AnimatePresence>
      </Drawer>
      
      <Main open={open}>
        <Outlet />
      </Main>
    </Box>
  );
};

export default MainLayout; 