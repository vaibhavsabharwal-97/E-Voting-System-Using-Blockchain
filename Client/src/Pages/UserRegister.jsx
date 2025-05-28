import React, { useState, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  useTheme,
  Stack,
  Divider,
  Link as MuiLink,
  Paper,
  Grid
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { 
  Visibility, 
  VisibilityOff, 
  LockOutlined, 
  Person, 
  Email, 
  AccountCircle,
  Phone,
  Home,
  CreditCard
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { serverLink } from "../Data/Variables";
import axios from "axios";
import Navbar from "../Components/User/Navbar";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

const UserRegister = () => {
  const theme = useTheme();
  const { mode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    aadharNumber: ''
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
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setAlert({
        show: true,
        message: 'Passwords do not match',
        severity: 'error'
      });
      return;
    }
    
    // Validate Aadhar number format (12 digits)
    if (!/^\d{12}$/.test(formData.aadharNumber)) {
      setAlert({ 
        show: true, 
        message: 'Aadhar number must be exactly 12 digits', 
        severity: 'error' 
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Submit registration data directly
      const response = await axios.post(serverLink + "register", {
        fname: formData.firstName,
        lname: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        mobile: formData.phoneNumber,
        location: formData.address,
        aadharNumber: formData.aadharNumber
      });
      
      setAlert({
        show: true,
        message: 'Registration successful! Please log in.',
        severity: 'success'
      });
      
      // Redirect to login after success
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error("Registration error:", error);
      setAlert({
        show: true,
        message: error.response?.data || 'An error occurred during registration',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 8, flex: 1 }}>
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
                <AccountCircle sx={{ fontSize: 48, mb: 1 }} />
              </MotionBox>
              <MotionTypography component="h1" variant="h5" fontWeight="bold">
                Create an Account
              </MotionTypography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Register to participate in secure blockchain voting
              </Typography>
            </Box>
            
            <Box sx={{ px: 4, py: 4 }}>
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
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      fullWidth
                      required
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
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      fullWidth
                      required
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
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
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
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Home color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Aadhar Number"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleChange}
                      fullWidth
                      required
                      inputProps={{ maxLength: 12 }}
                      helperText="Enter your 12-digit Aadhar card number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCard color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: 2,
                        },
                        mt: 2,
                        mb: 2
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2 }}>
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
                        {loading ? 'Creating Account...' : 'Register'}
                      </MotionButton>
                      
                      <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          OR
                        </Typography>
                      </Divider>
                      
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Already have an account?
                        </Typography>
                        <MuiLink 
                          component={Link} 
                          to="/login" 
                          variant="body2" 
                          sx={{ fontWeight: 'bold' }}
                        >
                          Sign In
                        </MuiLink>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Paper>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default UserRegister;
