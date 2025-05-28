import React, { useState, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Alert,
  useTheme,
  Stack,
  Divider,
  Link as MuiLink,
  Paper
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff, LockOutlined, Person, Email } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { serverLink } from "../Data/Variables";
import axios from "axios";
import Navbar from "../Components/User/Navbar";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

const UserLogin = () => {
  const theme = useTheme();
  const { mode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Here you would implement the actual login logic
      // For now just simulating a login attempt
      const response = await axios.post(serverLink + "login", formData);
      
      if (response.status === 200) {
        setAlert({
          show: true,
          message: 'Login successful! Redirecting...',
          severity: 'success'
        });
        
        // Redirect after success
        setTimeout(() => {
          navigate('/elections');
        }, 1500);
      } else {
        setAlert({
          show: true,
          message: response.data || 'Invalid credentials',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setAlert({
        show: true,
        message: error.response?.data || 'An error occurred during login',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 8, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <MotionBox
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              width: '100%',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                py: 3,
                bgcolor: theme.palette.primary.main,
                color: 'white',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
              }}
            >
              <MotionBox
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Person sx={{ fontSize: 48, mb: 1 }} />
              </MotionBox>
              <MotionTypography component="h1" variant="h5" fontWeight="bold">
                User Login
              </MotionTypography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Access your voting account
              </Typography>
            </Box>
            
            <CardContent sx={{ px: 4, py: 4 }}>
              {alert.show && (
                <Alert 
                  severity={alert.severity} 
                  sx={{ mb: 3, borderRadius: 1 }}
                  onClose={() => setAlert({ ...alert, show: false })}
                >
                  {alert.message}
                </Alert>
              )}
                
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    required
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  
                  <TextField
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handlePasswordToggle}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  
                  <MotionButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ 
                      py: 1.5, 
                      mt: 1,
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      background: loading ? '' : 'linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)',
                      '&:hover': {
                        background: loading ? '' : 'linear-gradient(90deg, #3a0ca3 0%, #4361ee 100%)',
                      },
                      boxShadow: '0 4px 10px rgba(67, 97, 238, 0.3)',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </MotionButton>
                  
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Don't have an account?
                    </Typography>
                    <MuiLink 
                      component={Link} 
                      to="/register" 
                      variant="body2" 
                      sx={{ fontWeight: 'bold' }}
                    >
                      Register Now
                    </MuiLink>
                  </Box>
                </Stack>
              </form>
            </CardContent>
          </Paper>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              By logging in, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default UserLogin;
