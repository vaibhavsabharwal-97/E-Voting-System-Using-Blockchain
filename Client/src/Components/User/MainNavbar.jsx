import React, { useState, useContext } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  useScrollTrigger,
  alpha,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Tooltip,
  Divider,
  ListItemIcon,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PollIcon from '@mui/icons-material/Poll';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ThemeContext } from '../../context/ThemeContext';
import { WebsiteDetails } from '../../Data/SidebarData';

// Indian flag colors
const saffron = '#FF9933';
const white = '#FFFFFF';
const green = '#138808';
const navy = '#000080';

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

// Updated AppBar to match Indian government design with purple gradient
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderBottom: 'none',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  fontWeight: 500,
  fontSize: '16px',
  textTransform: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-1px)',
  },
}));

const AdminButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#10b981',
  color: 'white',
  fontWeight: 600,
  fontSize: '14px',
  textTransform: 'none',
  padding: '8px 20px',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#059669',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
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

export default function MainNavbar() {
  const theme = useTheme();
  const { mode, toggleColorMode } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationEl, setNotificationEl] = useState(null);
  const [notifications] = useState(2); // Demo notification count
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
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
        <StyledAppBar position="fixed" elevation={0} sx={{ top: '4px' }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ py: 1, minHeight: '64px' }}>
              {/* Logo & Title */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Box 
                  component={Link}
                  to="/"
                  sx={{ 
                    mr: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.15)',
                    width: 40,
                    height: 40,
                    borderRadius: '8px',
                    backdropFilter: 'blur(4px)',
                    textDecoration: 'none',
                  }}
                >
                  {/* Indian Government Emblem Style Icon */}
                  <Box sx={{ color: 'white', fontSize: 20 }}>🏛️</Box>
                </Box>
                <Box component={Link} to="/" sx={{ textDecoration: 'none', color: 'white' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      letterSpacing: '0.3px',
                      fontSize: '18px',
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    Blockchain E-Voting
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 400,
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      fontSize: '12px',
                      opacity: 0.9,
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    भारत निर्वाचन आयोग | Election Commission of India
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      letterSpacing: '0.3px',
                      fontSize: '16px',
                      display: { xs: 'block', sm: 'none' }
                    }}
                  >
                    ई-मतदान | E-Vote
                  </Typography>
                </Box>
              </motion.div>

              {/* Desktop Navigation - Centered */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <NavButton
                    component={Link}
                    to="/"
                    startIcon={<HomeIcon />}
                    sx={{ mx: 1 }}
                  >
                    🏠 Home
                  </NavButton>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <NavButton
                    component={Link}
                    to="/elections"
                    startIcon={<HowToVoteIcon />}
                    sx={{ mx: 1 }}
                  >
                    🗳️ Elections
                  </NavButton>
                </motion.div>
              </Box>

              {/* Right side actions */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Theme toggle - hidden on mobile */}
                <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                  <IconButton 
                    onClick={toggleColorMode} 
                    sx={{ 
                      color: 'white',
                      mr: 1,
                      display: { xs: 'none', sm: 'flex' },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                </Tooltip>

                {/* Admin button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AdminButton
                    component={Link}
                    to="/admin"
                    startIcon={<AdminPanelSettingsIcon />}
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                  >
                    👨‍💼 Admin
                  </AdminButton>
                </motion.div>

                {/* Mobile menu toggle */}
                <IconButton
                  color="inherit"
                  aria-label="open mobile menu"
                  onClick={toggleMobileMenu}
                  sx={{ 
                    display: { xs: 'flex', md: 'none' },
                    ml: 1,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </StyledAppBar>
      </HideOnScroll>

      {/* Mobile Menu */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1200,
          transition: 'all 0.3s ease',
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
        }}
        onClick={toggleMobileMenu}
      />
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '80%',
          maxWidth: '300px',
          height: '100%',
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)',
          zIndex: 1300,
          boxShadow: '-5px 0 25px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
        }}
      >
        {/* Indian tricolor strip in mobile menu */}
        <Box sx={{ 
          background: `linear-gradient(90deg, ${saffron} 0%, ${white} 50%, ${green} 100%)`,
          height: '4px'
        }} />
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>मेन्यू | Menu</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>भारत निर्वाचन आयोग</Typography>
          </Box>
          <IconButton color="inherit" onClick={toggleMobileMenu}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Button 
            component={Link} 
            to="/" 
            color="inherit" 
            startIcon={<HomeIcon />}
            onClick={toggleMobileMenu}
            sx={{ 
              py: 1.5, 
              justifyContent: 'flex-start',
              borderRadius: '8px',
              mb: 1,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            🏠 होम | Home
          </Button>
          <Button 
            component={Link} 
            to="/elections" 
            color="inherit" 
            startIcon={<HowToVoteIcon />}
            onClick={toggleMobileMenu}
            sx={{ 
              py: 1.5, 
              justifyContent: 'flex-start',
              borderRadius: '8px',
              mb: 1,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            🗳️ चुनाव | Elections
          </Button>
          <Button 
            component={Link} 
            to="/admin" 
            color="inherit" 
            startIcon={<AdminPanelSettingsIcon />}
            onClick={toggleMobileMenu}
            sx={{ 
              py: 1.5, 
              justifyContent: 'flex-start',
              borderRadius: '8px',
              mb: 1,
              backgroundColor: '#10b981',
              '&:hover': { bgcolor: '#059669' }
            }}
          >
            👨‍💼 प्रशासन | Admin
          </Button>
        </Box>
        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        <Box sx={{ p: 2 }}>
          <Button 
            onClick={() => { toggleColorMode(); toggleMobileMenu(); }}
            color="inherit" 
            startIcon={mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            sx={{ 
              py: 1.5, 
              justifyContent: 'flex-start',
              borderRadius: '8px',
              width: '100%',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            {mode === 'dark' ? '🌞 प्रकाश मोड | Light Mode' : '🌙 अंधेरा मोड | Dark Mode'}
          </Button>
        </Box>
        
        {/* Footer with government motto */}
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.1)'
        }}>
          <Typography variant="caption" sx={{ 
            color: saffron, 
            fontWeight: 'bold',
            display: 'block',
            mb: 0.5
          }}>
            सत्यमेव जयते
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Truth Alone Triumphs
          </Typography>
        </Box>
      </Box>
    </Box>
  );
} 