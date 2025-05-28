import React, { useState, useContext, useEffect } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  IconButton, 
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  alpha,
  Container,
  Avatar,
  Badge,
  Tooltip,
  useScrollTrigger,
  Chip
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { NavbarData } from "../../Data/NavbarData";

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import HomeIcon from '@mui/icons-material/Home';
import HowToVoteOutlinedIcon from '@mui/icons-material/HowToVoteOutlined';
import PollIcon from '@mui/icons-material/Poll';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Custom styled components
const GlassMorphicAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'rgba(18, 18, 18, 0.7)'
    : 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 30px rgba(0, 0, 0, 0.5)'
    : '0 4px 30px rgba(0, 0, 0, 0.1)',
  borderBottom: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.05)'
    : '1px solid rgba(255, 255, 255, 0.3)',
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  borderRadius: '12px',
  padding: '8px 16px',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
  fontWeight: active ? 700 : 500,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: 'translateY(-2px)',
  },
  '&::before': active ? {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '3px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: '3px 3px 0 0',
  } : {},
}));

const LogoText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
  letterSpacing: '0.5px',
}));

const MobileNavItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: '12px',
  margin: '8px 16px',
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: 'translateX(5px)',
  },
}));

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

export default function Navbar() {
  const theme = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleColorMode } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);
  const [notifications] = useState(3); // Demo notification count

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

  // Handle mobile drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Get icon for navigation item
  const getNavIcon = (title) => {
    switch(title) {
      case "Home":
        return <HomeIcon fontSize="small" />;
      case "Election":
        return <HowToVoteOutlinedIcon fontSize="small" />;
      case "Result":
        return <PollIcon fontSize="small" />;
      default:
        return <HomeIcon fontSize="small" />;
    }
  };

  // Check if route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Mobile drawer content
  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
        pt: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: "easeInOut", repeat: 0 }}
          >
            <Avatar
              sx={{ 
                bgcolor: 'transparent', 
                border: `2px solid ${theme.palette.primary.main}`,
                p: 0.5,
                mr: 1.5
              }}
            >
              <HowToVoteIcon color="primary" />
            </Avatar>
          </motion.div>
          <LogoText variant="h6">
            E-Voting
          </LogoText>
        </Box>
        <IconButton onClick={handleDrawerToggle} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ flexGrow: 1, mt: 2 }}>
        {NavbarData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <MobileNavItem
              button
              component={Link}
              to={item.link}
              onClick={handleDrawerToggle}
              active={isActive(item.link) ? 1 : 0}
            >
              <Box sx={{ 
                mr: 2, 
                color: isActive(item.link) ? theme.palette.primary.main : 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1,
                borderRadius: '10px',
                bgcolor: isActive(item.link) ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
              }}>
                {getNavIcon(item.title)}
              </Box>
              <ListItemText 
                primary={item.title} 
                primaryTypographyProps={{ 
                  fontWeight: isActive(item.link) ? 700 : 500,
                  color: isActive(item.link) ? 'primary' : 'textPrimary'
                }} 
              />
              {isActive(item.link) && (
                <Box sx={{ 
                  ml: 1, 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  bgcolor: theme.palette.primary.main 
                }} />
              )}
            </MobileNavItem>
          </motion.div>
        ))}
      </List>

      <Box sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Button
          component={Link}
          to="/admin"
          fullWidth
          variant="contained"
          color="secondary"
          size="large"
          sx={{
            borderRadius: '12px',
            py: 1.5,
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            fontWeight: 'bold',
            mb: 2
          }}
          startIcon={<AdminPanelSettingsIcon />}
        >
          Admin Portal
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Chip
            icon={mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            label={mode === 'dark' ? "Light Mode" : "Dark Mode"}
            onClick={toggleColorMode}
            variant="outlined"
            sx={{ borderRadius: '10px', px: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'flex-end' }}>
            v1.0.0
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <HideOnScroll>
        <GlassMorphicAppBar position="fixed" elevation={scrolled ? 4 : 0}>
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ py: 1 }}>
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                  <motion.div
                    whileHover={{ rotate: [0, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Avatar
                      component={Link}
                      to="/"
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        border: `2px solid ${theme.palette.primary.main}`,
                        p: 0.8,
                        mr: 1.5,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                        }
                      }}
                    >
                      <HowToVoteIcon color="primary" />
                    </Avatar>
                  </motion.div>
                  <LogoText
                    variant="h5"
                    noWrap
                    component={Link}
                    to="/"
                    sx={{
                      textDecoration: 'none',
                      display: { xs: 'none', sm: 'flex' },
                    }}
                  >
                    E-Voting
                  </LogoText>
                </Box>
              </motion.div>

              {/* Mobile menu button */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, justifyContent: 'flex-end' }}>
                <IconButton
                  size="large"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
                    mr: 1
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>

              {/* Desktop navigation */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                {NavbarData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -3 }}
                  >
                    <NavButton
                      component={Link}
                      to={item.link}
                      active={isActive(item.link) ? 1 : 0}
                      sx={{ mx: 0.5 }}
                      startIcon={getNavIcon(item.title)}
                    >
                      {item.title}
                    </NavButton>
                  </motion.div>
                ))}
              </Box>

              {/* Right side items */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Theme toggle */}
                <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                  <IconButton 
                    onClick={toggleColorMode} 
                    sx={{ 
                      ml: 1, 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                </Tooltip>

                {/* Notifications */}
                <Tooltip title="Notifications">
                  <IconButton 
                    sx={{ 
                      ml: 1, 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    <Badge badgeContent={notifications} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* Admin button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={Link}
                    to="/admin"
                    variant="contained"
                    color="secondary"
                    startIcon={<AdminPanelSettingsIcon />}
                    sx={{
                      ml: 2,
                      borderRadius: '12px',
                      px: 2,
                      py: 1,
                      fontWeight: 'bold',
                      display: { xs: 'none', sm: 'flex' },
                      background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
                      boxShadow: `0 5px 15px ${alpha(theme.palette.secondary.main, 0.4)}`,
                      '&:hover': {
                        boxShadow: `0 8px 20px ${alpha(theme.palette.secondary.main, 0.6)}`,
                      }
                    }}
                  >
                    Admin
                  </Button>
                </motion.div>
              </Box>
            </Toolbar>
          </Container>
        </GlassMorphicAppBar>
      </HideOnScroll>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            width: '85%', 
            maxWidth: 320,
            borderRadius: '0 20px 20px 0',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          },
        }}
      >
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ height: '100%' }}
            >
              {drawer}
            </motion.div>
          )}
        </AnimatePresence>
      </Drawer>

      {/* Toolbar spacer */}
      <Toolbar sx={{ mb: 1 }} />
    </>
  );
}
