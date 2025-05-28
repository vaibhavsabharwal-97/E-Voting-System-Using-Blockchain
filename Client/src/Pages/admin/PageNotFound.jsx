import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  useTheme, 
  alpha,
  Grid
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);
const MotionButton = motion(Button);

const PageNotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.9)}, ${alpha(theme.palette.background.paper, 0.9)})`
          : `linear-gradient(to bottom, ${alpha(theme.palette.primary.light, 0.05)}, ${alpha(theme.palette.background.default, 1)})`,
        position: 'relative',
        overflow: 'hidden',
        py: 8
      }}
    >
      {/* Decorative elements */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: -100, 
        left: -100, 
        width: 300, 
        height: 300, 
        borderRadius: '50%', 
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
      }} />
      <Box sx={{ 
        position: 'absolute', 
        top: -50, 
        right: -50, 
        width: 200, 
        height: 200, 
        borderRadius: '50%', 
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
      }} />

      <Container maxWidth="md">
        <MotionPaper 
          elevation={3}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ 
            p: { xs: 3, sm: 5 }, 
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 100%)`,
                    boxShadow: `0 10px 20px ${alpha(theme.palette.warning.main, 0.3)}`,
                    mb: 3,
                    mx: { xs: 'auto', md: 0 }
                  }}
                >
                  <ErrorOutlineIcon 
                    sx={{ 
                      fontSize: 70, 
                      color: 'white'
                    }} 
                  />
                </Box>
              </MotionBox>
              
              <MotionTypography 
                variant="h1" 
                component="h1" 
                fontWeight="800" 
                sx={{ color: theme.palette.warning.main }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                404
              </MotionTypography>
              
              <MotionTypography 
                variant="h4" 
                fontWeight="bold"
                gutterBottom
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Page Not Found
              </MotionTypography>
              
              <MotionTypography 
                variant="body1" 
                color="textSecondary" 
                sx={{ mb: 4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                The page you are looking for might have been removed, had its name changed, 
                or is temporarily unavailable.
              </MotionTypography>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}
              >
                <MotionButton 
                  variant="contained" 
                  size="large"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate('/')}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back to Home
                </MotionButton>
                
                <MotionButton 
                  variant="outlined" 
                  size="large"
                  startIcon={<HowToVoteIcon />}
                  component={Link}
                  to="/elections"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: 2,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Elections
                </MotionButton>
              </MotionBox>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <Box
                  component="img"
                  src="https://img.freepik.com/free-vector/page-found-concept-illustration_114360-1869.jpg"
                  alt="404 Illustration"
                  sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  }}
                />
              </MotionBox>
            </Grid>
          </Grid>
        </MotionPaper>
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} Blockchain E-Voting System
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PageNotFound;
