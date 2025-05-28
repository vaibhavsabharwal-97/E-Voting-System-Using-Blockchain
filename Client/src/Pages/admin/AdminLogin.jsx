import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert, Paper, InputAdornment, IconButton, Fade, useTheme } from "@mui/material";
import { Visibility, VisibilityOff, Email, HowToVote, AdminPanelSettings } from "@mui/icons-material";
import { motion } from "framer-motion";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"© "}
      <Link color="inherit" href="http://localhost:3000">
        भारत निर्वाचन आयोग | Election Commission of India
      </Link>{" "}
      {new Date().getFullYear()}
      {" | सभी अधिकार सुरक्षित | All rights reserved"}
    </Typography>
  );
}

export default function AdminLogin() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "admin@gmail.com",
    password: "admin123",
    rememberMe: false
  });
  
  // Indian flag colors
  const saffron = '#FF9933';
  const white = '#FFFFFF';
  const green = '#138808';
  const navy = '#000080';
  
  // Get the redirect path from location state, or default to dashboard
  const from = location.state?.from || "/admin/dashboard";
  
  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value
    }));
  };
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (formData.password === "admin123" && formData.email === "admin@gmail.com") {
      // Set authentication in localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "admin");
      
      // Redirect to the page they were trying to access or dashboard
      navigate(from);
    } else {
      setError("अवैध ईमेल या पासवर्ड | Invalid email or password. Try admin@gmail.com / admin123");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: '#f8f9fa',
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Indian Government Style Header */}
      <Box sx={{ 
        background: `linear-gradient(90deg, ${saffron} 0%, ${white} 50%, ${green} 100%)`,
        height: '8px'
      }} />
      
      {/* Official Header */}
      <Box sx={{ 
        backgroundColor: navy,
        color: white,
        py: 2,
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h6" fontWeight="bold">
            भारत निर्वाचन आयोग - Election Commission of India
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            प्रशासनिक पोर्टल | Administrative Portal
          </Typography>
        </Container>
      </Box>

      {/* National Emblem Style Section */}
      <Box sx={{ 
        backgroundColor: white,
        borderBottom: `4px solid ${saffron}`,
        py: 2
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: navy, mb: 0.5 }}>
              🏛️ प्रशासक लॉगिन पोर्टल
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: navy }}>
              Administrator Login Portal
            </Typography>
            <Typography variant="body2" sx={{ color: green, fontWeight: 'bold', mt: 0.5 }}>
              अधिकृत व्यक्तियों के लिए | For Authorized Personnel Only
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Decorative background elements */}
      <Box sx={{
        position: "absolute",
        top: 150,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: "50%",
        border: `3px solid ${alpha(saffron, 0.2)}`,
        zIndex: 0
      }} />
      <Box sx={{
        position: "absolute",
        bottom: 100,
        left: -50,
        width: 150,
        height: 150,
        borderRadius: "50%",
        border: `2px solid ${alpha(green, 0.2)}`,
        zIndex: 0
      }} />

      <Container component="main" maxWidth="sm" sx={{ zIndex: 1, flex: 1, display: 'flex', alignItems: 'center' }}>
        <CssBaseline />
        <Box
          sx={{
            width: '100%',
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 4
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Avatar 
              sx={{ 
                m: 1, 
                bgcolor: navy,
                width: 80,
                height: 80,
                boxShadow: `0 6px 20px ${alpha(navy, 0.4)}`,
                border: `3px solid ${saffron}`
              }}
            >
              <AdminPanelSettings sx={{ fontSize: 40 }} />
            </Avatar>
          </motion.div>
          
          <Fade in={true} timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography 
                component="h1" 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  color: navy,
                  mb: 1
                }}
              >
                प्रशासक पोर्टल
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600,
                  color: green
                }}
              >
                Admin Portal
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
                चुनाव प्रबंधन प्रणाली | Election Management System
              </Typography>
            </Box>
          </Fade>
          
          <Paper 
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            elevation={8} 
            sx={{ 
              p: 5, 
              width: "100%",
              borderRadius: 4,
              boxShadow: `0 12px 40px ${alpha(navy, 0.15)}`,
              border: `2px solid ${alpha(saffron, 0.2)}`,
              background: `linear-gradient(145deg, ${white} 0%, ${alpha(saffron, 0.02)} 100%)`
            }}
          >
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  border: `1px solid #e53e3e`,
                  '& .MuiAlert-icon': {
                    color: '#e53e3e'
                  }
                }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            {/* Login Instructions */}
            <Paper sx={{ 
              p: 3, 
              mb: 4, 
              backgroundColor: alpha(green, 0.05),
              border: `1px solid ${alpha(green, 0.2)}`,
              borderRadius: 2
            }}>
              <Typography variant="h6" sx={{ color: navy, fontWeight: 600, mb: 2 }}>
                🔐 लॉगिन निर्देश | Login Instructions
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                <strong>डिफ़ॉल्ट क्रेडेंशियल | Default Credentials:</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: green, fontFamily: 'monospace' }}>
                📧 Email: admin@gmail.com<br/>
                🔑 Password: admin123
              </Typography>
            </Paper>
            
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="ईमेल पता | Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: saffron,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: saffron,
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: saffron,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: navy }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="पासवर्ड | Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: saffron,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: saffron,
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: saffron,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: navy }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: navy }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    sx={{
                      color: saffron,
                      '&.Mui-checked': {
                        color: saffron,
                      },
                    }}
                  />
                }
                label="मुझे याद रखें | Remember me"
                sx={{ 
                  mt: 2, 
                  mb: 2,
                  '& .MuiFormControlLabel-label': {
                    color: navy,
                    fontWeight: 500
                  }
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  py: 1.5,
                  backgroundColor: saffron,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: alpha(saffron, 0.8),
                    boxShadow: `0 6px 20px ${alpha(saffron, 0.4)}`
                  }
                }}
                component={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                लॉग इन | Sign In
              </Button>
              
              <Box sx={{ 
                textAlign: 'center', 
                mt: 3,
                p: 2,
                backgroundColor: alpha(navy, 0.05),
                borderRadius: 2,
                border: `1px solid ${alpha(navy, 0.1)}`
              }}>
                <Typography variant="body2" sx={{ color: navy, fontWeight: 500 }}>
                  🔒 यह एक सुरक्षित सरकारी पोर्टल है
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  This is a secure government portal
                </Typography>
              </Box>
              
              <Grid container sx={{ mt: 2 }}>
                <Grid item xs>
                  <Link 
                    href="#" 
                    variant="body2" 
                    sx={{ 
                      color: green,
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    पासवर्ड भूल गए? | Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link 
                    component="button"
                    variant="body2" 
                    onClick={() => navigate('/')}
                    sx={{ 
                      color: navy,
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    मुख्य पृष्ठ | Back to Home
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Container>
      
      {/* Footer */}
      <Box sx={{ 
        backgroundColor: navy,
        color: white,
        py: 3,
        mt: 'auto'
      }}>
        <Container maxWidth="lg">
          <Copyright sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
        </Container>
      </Box>
    </Box>
  );
}
