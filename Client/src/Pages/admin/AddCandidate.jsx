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
  Alert,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverLink } from '../../Data/Variables';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const AddCandidate = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    dob: null,
    qualification: '',
    join: '',
    location: '',
    description: '',
    partyName: '',
    partySymbol: '',
    profileImage: ''
  });
  
  const [previewProfileImage, setPreviewProfileImage] = useState(null);
  const [previewPartySymbol, setPreviewPartySymbol] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create a preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    if (type === 'profile') {
      setPreviewProfileImage(previewUrl);
    } else {
      setPreviewPartySymbol(previewUrl);
    }

    // Store the actual file for form submission
    const fieldName = type === 'profile' ? 'profileImage' : 'partySymbol';
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };
  
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dob: date
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Simple validation
      if (!formData.dob) {
        setAlert({ 
          show: true, 
          message: 'Date of birth is required', 
          severity: 'error' 
        });
        return;
      }
      
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'profileImage' && key !== 'partySymbol') {
          if (key === 'join') {
            formDataToSend.append(key, parseInt(formData[key], 10));
          } else if (key === 'dob') {
            formDataToSend.append(key, formData[key].toISOString());
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });
      
      // Add image files if they exist
      if (formData.profileImage instanceof File) {
        formDataToSend.append('profileImage', formData.profileImage);
      }
      if (formData.partySymbol instanceof File) {
        formDataToSend.append('partySymbol', formData.partySymbol);
      }
      
      // Submit to API with proper headers for multipart/form-data
      const response = await axios.post(serverLink + 'candidate/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setAlert({ 
        show: true, 
        message: response.data.message || 'Candidate created successfully', 
        severity: 'success' 
      });
      
      // Reset form
      setFormData({
        username: '',
        firstName: '',
        lastName: '',
        dob: null,
        qualification: '',
        join: '',
        location: '',
        description: '',
        partyName: '',
        partySymbol: '',
        profileImage: ''
      });
      
      setPreviewProfileImage(null);
      setPreviewPartySymbol(null);
      
      // Navigate back after short delay
      setTimeout(() => {
        navigate('/admin/candidates');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating candidate:', error);
      setAlert({ 
        show: true, 
        message: error.response?.data?.error || error.response?.data || 'Error creating candidate', 
        severity: 'error' 
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 3, pb: 6 }}>
        {alert.show && (
          <Alert 
            severity={alert.severity} 
            sx={{ mb: 3 }}
            onClose={() => setAlert({ ...alert, show: false })}
          >
            {alert.message}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton 
            onClick={() => navigate('/admin/candidates')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Add New Candidate
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                {/* Profile Image Upload */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="profile-image-upload"
                      type="file"
                      onChange={(e) => handleImageUpload(e, 'profile')}
                    />
                    <label htmlFor="profile-image-upload">
                      <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar
                          src={previewProfileImage}
                          sx={{
                            width: 120,
                            height: 120,
                            mb: 1,
                            cursor: 'pointer',
                            '&:hover': {
                              opacity: 0.8,
                            },
                          }}
                        >
                          {previewProfileImage ? null : <PhotoCamera />}
                        </Avatar>
                      </Box>
                    </label>
                    <Typography variant="caption" display="block">
                      Click to upload profile photo
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Username"
                    name="username"
                    fullWidth
                    required
                    value={formData.username}
                    onChange={handleChange}
                    helperText="Unique username for the candidate"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    fullWidth
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    fullWidth
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date of Birth"
                      value={formData.dob}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth required />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Qualification"
                    name="qualification"
                    fullWidth
                    required
                    value={formData.qualification}
                    onChange={handleChange}
                    helperText="Educational qualification"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Years of Experience"
                    name="join"
                    type="number"
                    fullWidth
                    required
                    value={formData.join}
                    onChange={handleChange}
                    inputProps={{ min: 0 }}
                    helperText="Total years of professional experience"
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

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Party Name"
                    name="partyName"
                    fullWidth
                    value={formData.partyName}
                    onChange={handleChange}
                    helperText="Name of the political party"
                  />
                </Grid>

                {/* Party Symbol Upload */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center', border: '1px dashed grey', borderRadius: 1, p: 2 }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="party-symbol-upload"
                      type="file"
                      onChange={(e) => handleImageUpload(e, 'party')}
                    />
                    <label htmlFor="party-symbol-upload">
                      <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        {previewPartySymbol ? (
                          <img 
                            src={previewPartySymbol} 
                            alt="Party Symbol" 
                            style={{ 
                              maxWidth: '100px', 
                              maxHeight: '100px',
                              cursor: 'pointer',
                            }} 
                          />
                        ) : (
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<PhotoCamera />}
                          >
                            Upload Party Symbol
                          </Button>
                        )}
                      </Box>
                    </label>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    helperText="Brief description about the candidate"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  size="large"
                >
                  Save Candidate
                </Button>
              </Box>
            </CardContent>
          </Card>
        </form>
      </Box>
    </Container>
  );
};

export default AddCandidate; 