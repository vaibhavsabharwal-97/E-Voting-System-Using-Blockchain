import * as React from "react";
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Grid, 
  Paper,
  Avatar,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  CircularProgress
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ContentHeader from "../../../Components/ContentHeader";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CSVCandidateUpload from "../../../Components/CSVCandidateUpload";

export default function AddCandidate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    dob: null,
    join: new Date().getFullYear(),
    qualification: '',
    location: '',
    description: '',
    partyName: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [partySymbol, setPartySymbol] = useState(null);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [previewSymbol, setPreviewSymbol] = useState(null);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dob: date
    }));
  };

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      setShowError(true);
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    
    if (type === 'profile') {
      setProfileImage(file);
      setPreviewProfile(previewUrl);
    } else {
      setPartySymbol(file);
      setPreviewSymbol(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowError(false);
    setLoading(true);

    try {
      // Validate required fields
      const requiredFields = ['username', 'firstName', 'dob', 'qualification', 'location', 'join'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Validate date
      if (!(formData.dob instanceof Date) || isNaN(formData.dob)) {
        throw new Error('Please select a valid date of birth');
      }

      const submitData = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          if (key === 'dob') {
            submitData.append(key, formData[key].toISOString());
          } else if (key === 'join') {
            submitData.append(key, parseInt(formData[key]));
          } else {
            submitData.append(key, formData[key]);
          }
        }
      });

      // Add images if they exist
      if (profileImage) {
        submitData.append('profileImage', profileImage);
      }
      if (partySymbol) {
        submitData.append('partySymbol', partySymbol);
      }

      const response = await axios.post(
        "http://localhost:1322/api/auth/candidate/register", 
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.status === 201) {
        navigate("/admin/candidates");
      }
    } catch (error) {
      console.error('Error creating candidate:', error);
      setError(error.response?.data?.error || error.message || 'Error creating candidate');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin__content">
      <ContentHeader />
      <div className="content">
        <Typography variant="h6" gutterBottom>
          Add Candidates
        </Typography>
        
        {/* CSV Upload Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Bulk Upload Candidates
          </Typography>
          <CSVCandidateUpload onUploadSuccess={() => navigate('/admin/candidates')} />
        </Box>

        <Divider sx={{ my: 4 }}>
          <Typography variant="body2" color="textSecondary">
            OR
          </Typography>
        </Divider>

        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Add Single Candidate
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Paper elevation={3}>
            <Box px={3} py={2}>
              <Typography variant="h6" align="center" margin="dense">
                Add Candidate
              </Typography>

              {/* Profile Image Upload */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-upload"
                    type="file"
                    onChange={(e) => handleImageUpload(e, 'profile')}
                  />
                  <label htmlFor="profile-upload">
                    <Avatar
                      src={previewProfile}
                      sx={{
                        width: 100,
                        height: 100,
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.8 },
                        mb: 1
                      }}
                    >
                      {!previewProfile && <PhotoCamera />}
                    </Avatar>
                  </label>
                  <Typography variant="caption" display="block">
                    Click to upload profile photo
                  </Typography>
                </Box>
              </Box>

              <Grid container pt={3} spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Username"
                    name="username"
                    fullWidth
                    required
                    value={formData.username}
                    onChange={handleChange}
                    helperText="Username must be unique"
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
                        <TextField
                          {...params}
                          required
                          fullWidth
                          name="dob"
                          helperText="Required"
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="number"
                    label="Politics Join From (Year)"
                    name="join"
                    fullWidth
                    required
                    inputProps={{ min: 1900, max: new Date().getFullYear() }}
                    value={formData.join}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Qualification"
                    name="qualification"
                    fullWidth
                    required
                    value={formData.qualification}
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

                {/* Party Details */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Party Details
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Party Name"
                    name="partyName"
                    fullWidth
                    value={formData.partyName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    border: '1px dashed grey', 
                    borderRadius: 1, 
                    p: 2, 
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="party-symbol-upload"
                      type="file"
                      onChange={(e) => handleImageUpload(e, 'symbol')}
                    />
                    <label htmlFor="party-symbol-upload">
                      {previewSymbol ? (
                        <Box sx={{ position: 'relative', cursor: 'pointer' }}>
                          <img 
                            src={previewSymbol} 
                            alt="Party Symbol" 
                            style={{ maxWidth: '100px', maxHeight: '100px' }} 
                          />
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            Click to change party symbol
                          </Typography>
                        </Box>
                      ) : (
                        <IconButton 
                          color="primary" 
                          component="span"
                          sx={{ flexDirection: 'column', gap: 1 }}
                        >
                          <AddPhotoAlternateIcon />
                          <Typography variant="caption">
                            Upload Party Symbol
                          </Typography>
                        </IconButton>
                      )}
                    </label>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    multiline
                    rows={5}
                    fullWidth
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Box mt={3}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Adding Candidate...' : 'Add Candidate'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </form>
      </div>

      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}
