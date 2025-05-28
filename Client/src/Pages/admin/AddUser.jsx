import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  TextField, 
  Button,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverLink } from '../../Data/Variables';

const AddUser = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    fname: '',
    lname: '',
    location: '',
    aadharNumber: '',
    password: '',
    confirmPassword: '',
    dob: '',
    isAdmin: false
  });
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isAdmin' ? checked : value
    }));
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
    
    try {
      // Prepare data for submission
      const userData = {
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
        fname: formData.fname,
        lname: formData.lname,
        location: formData.location,
        aadharNumber: formData.aadharNumber,
        password: formData.password,
        dob: formData.dob,
        isAdmin: formData.isAdmin
      };
      
      // Submit to API
      await axios.post(serverLink + 'register', userData);
      
      setAlert({ 
        show: true, 
        message: 'User created successfully', 
        severity: 'success' 
      });
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        mobile: '',
        fname: '',
        lname: '',
        location: '',
        aadharNumber: '',
        password: '',
        confirmPassword: '',
        dob: '',
        isAdmin: false
      });
      
      // Navigate back after short delay
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating user:', error);
      setAlert({ 
        show: true, 
        message: error.response?.data || 'Error creating user', 
        severity: 'error' 
      });
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 2, pb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton 
            onClick={() => navigate('/admin/users')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Add New User
          </Typography>
        </Box>
        
        {alert.show && (
          <Alert 
            severity={alert.severity} 
            sx={{ mb: 3 }}
            onClose={() => setAlert({ ...alert, show: false })}
          >
            {alert.message}
          </Alert>
        )}
        
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Username"
                    name="username"
                    fullWidth
                    required
                    value={formData.username}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="fname"
                    fullWidth
                    required
                    value={formData.fname}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lname"
                    fullWidth
                    value={formData.lname}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Mobile"
                    name="mobile"
                    fullWidth
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Location"
                    name="location"
                    fullWidth
                    required
                    value={formData.location}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Aadhar Number"
                    name="aadharNumber"
                    fullWidth
                    required
                    value={formData.aadharNumber}
                    onChange={handleChange}
                    inputProps={{ maxLength: 12 }}
                    helperText="Enter 12-digit Aadhar number"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    fullWidth
                    required
                    value={formData.dob}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText="Enter your date of birth"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    fullWidth
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={formData.isAdmin} 
                        onChange={handleChange}
                        name="isAdmin"
                      />
                    }
                    label="Administrator Account"
                  />
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      type="button"
                      variant="outlined"
                      onClick={() => navigate('/admin/users')}
                      sx={{ mr: 2 }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                    >
                      Create User
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AddUser; 