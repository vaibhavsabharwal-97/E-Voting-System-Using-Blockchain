import * as React from "react";
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Alert,
  Avatar,
  IconButton,
  Divider,
  CircularProgress,
  Snackbar
} from "@mui/material";
import DatePicker from "../../../Components/Form/DatePicker";
import ContentHeader from "../../../Components/ContentHeader";
import InputField from "../../../Components/Form/InputField";
import { ErrorMessage } from "../../../Components/Form/ErrorMessage";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { serverLink, staticFileLink } from "../../../Data/Variables";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SaveIcon from '@mui/icons-material/Save';

export default function EditCandidate() {
  const today = new Date();
  const maxDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    qualification: '',
    location: '',
    description: '',
    join: 2000,
    partyName: ''
  });
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [partySymbol, setPartySymbol] = useState(null);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [previewSymbol, setPreviewSymbol] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    async function fetchCandidate() {
      try {
        const response = await axios.get(`${serverLink}candidate/id/${id}`);
        if (response.data) {
          setFormData({
            username: response.data.username || '',
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            qualification: response.data.qualification || '',
            location: response.data.location || '',
            description: response.data.description || '',
            join: response.data.join || 2000,
            partyName: response.data.partyName || ''
          });
          
          // Set image previews if they exist
          if (response.data.profileImage) {
            setPreviewProfile(`${staticFileLink}${response.data.profileImage}`);
          }
          if (response.data.partySymbol) {
            setPreviewSymbol(`${staticFileLink}${response.data.partySymbol}`);
          }
        }
      } catch (error) {
        console.error("Error fetching candidate:", error);
        setErrors({ submit: "Failed to load candidate data" });
      }
    }
    
    fetchCandidate();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any errors for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, [type]: 'Only image files are allowed' });
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    
    const joinYear = parseInt(formData.join);
    if (isNaN(joinYear) || joinYear < 1900 || joinYear > today.getFullYear()) {
      newErrors.join = "Please enter a valid year between 1900 and current year";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    try {
      // Validate form
      const formErrors = validateForm();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Add images if they were updated
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }
      if (partySymbol) {
        formDataToSend.append('partySymbol', partySymbol);
      }

      const response = await axios.post(
        `${serverLink}candidate/edit/${id}`, 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        // Navigate after showing success message
        setTimeout(() => {
          navigate("/admin/candidates");
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating candidate:", error);
      setErrors({ 
        submit: error.response?.data?.error || "Error updating candidate. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!formData.username) {
    return (
      <div className="admin__content">
        <ContentHeader title="Back to Candidates" link="/admin/candidates" />
        <div className="content">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        </div>
      </div>
    );
  }

  return (
    <div className="admin__content">
      <ContentHeader title="Back to Candidates" link="/admin/candidates" />
      <div className="content">
        <form onSubmit={handleSubmit}>
          <Paper elevation={3}>
            <Box px={3} py={2}>
              <Typography variant="h6" align="center" margin="dense">
                Edit Candidate
              </Typography>
              
              {errors.submit && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {errors.submit}
                </Alert>
              )}

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
                    Click to update profile photo
                  </Typography>
                </Box>
              </Box>
              
              <Grid container pt={3} spacing={3}>
                <Grid item xs={12} sm={12}>
                  <InputField
                    label="Username"
                    name="username"
                    fullWidth={true}
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {errors.username && <ErrorMessage message={errors.username} />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    label="First Name"
                    name="firstName"
                    fullWidth={true}
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && <ErrorMessage message={errors.firstName} />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField 
                    label="Last Name" 
                    name="lastName" 
                    fullWidth={true} 
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && <ErrorMessage message={errors.lastName} />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="number"
                    label="Politics Join From (Year)"
                    name="join"
                    fullWidth
                    inputProps={{ min: 1900, max: today.getFullYear() }}
                    value={formData.join}
                    onChange={handleChange}
                    variant="outlined"
                  />
                  {errors.join && <ErrorMessage message={errors.join} />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    label="Qualification"
                    name="qualification"
                    fullWidth={true}
                    value={formData.qualification}
                    onChange={handleChange}
                  />
                  {errors.qualification && <ErrorMessage message={errors.qualification} />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    label="Location"
                    name="location"
                    fullWidth={true}
                    value={formData.location}
                    onChange={handleChange}
                  />
                  {errors.location && <ErrorMessage message={errors.location} />}
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
                  <InputField
                    label="Party Name"
                    name="partyName"
                    fullWidth={true}
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
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </form>
      </div>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={1500}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Candidate updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
} 