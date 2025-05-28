import React, { useState, useEffect } from 'react';
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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  ListItemText,
  Checkbox,
  OutlinedInput,
  CircularProgress,
  Backdrop
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { serverLink } from '../../Data/Variables';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AddElection = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [candidates, setCandidates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    candidates: []
  });
  
  useEffect(() => {
    // Fetch available candidates
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(serverLink + 'candidates');
        setCandidates(response.data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setAlert({ 
          show: true, 
          message: 'Failed to load candidates. Please try refreshing the page.', 
          severity: 'error' 
        });
      }
    };
    
    fetchCandidates();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validation
      if (formData.name.trim() === '') {
        setAlert({
          show: true,
          message: 'Election name is required',
          severity: 'error'
        });
        return;
      }
      
      if (formData.candidates.length === 0) {
        setAlert({
          show: true,
          message: 'Please select at least one candidate',
          severity: 'error'
        });
        return;
      }
      
      // Set submitting state
      setIsSubmitting(true);
      
      // Submit to API
      await axios.post(serverLink + 'election/register', formData);
      
      // Show success
      setIsSuccess(true);
      setAlert({ 
        show: true, 
        message: 'Election created successfully', 
        severity: 'success' 
      });
      
      // Reset form
      setFormData({
        name: '',
        candidates: []
      });
      
      // Navigate back after short delay
      setTimeout(() => {
        navigate('/admin/elections', { state: { successMessage: 'Election created successfully!' } });
      }, 1500);
      
    } catch (error) {
      console.error('Error creating election:', error);
      setAlert({ 
        show: true, 
        message: error.response?.data?.message || 'Error creating election. Please try again.', 
        severity: 'error' 
      });
      setIsSubmitting(false);
    }
  };
  
  // Prevent navigation if form is being submitted
  const handleCancel = () => {
    if (isSubmitting) return;
    navigate('/admin/elections');
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 2, pb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton 
            onClick={handleCancel}
            sx={{ mr: 2 }}
            disabled={isSubmitting}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Add New Election
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
        
        <Card
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Election Name"
                    name="name"
                    fullWidth
                    required
                    value={formData.name}
                    onChange={handleChange}
                    helperText="Enter a descriptive name for the election"
                    disabled={isSubmitting || isSuccess}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth required disabled={isSubmitting || isSuccess}>
                    <InputLabel id="candidates-select-label">Candidates</InputLabel>
                    <Select
                      labelId="candidates-select-label"
                      id="candidates-select"
                      multiple
                      name="candidates"
                      value={formData.candidates}
                      onChange={handleChange}
                      input={<OutlinedInput label="Candidates" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const candidate = candidates.find(c => c._id === value);
                            return (
                              <Chip 
                                key={value} 
                                label={candidate ? `${candidate.firstName} ${candidate.lastName || ''}` : value} 
                              />
                            );
                          })}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {candidates.map((candidate) => (
                        <MenuItem key={candidate._id} value={candidate._id}>
                          <Checkbox checked={formData.candidates.indexOf(candidate._id) > -1} />
                          <ListItemText 
                            primary={`${candidate.firstName} ${candidate.lastName || ''}`} 
                            secondary={candidate.username}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      type="button"
                      variant="outlined"
                      onClick={handleCancel}
                      sx={{ mr: 2 }}
                      disabled={isSubmitting || isSuccess}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      variant="contained"
                      startIcon={isSuccess ? <CheckCircleIcon /> : <SaveIcon />}
                      disabled={isSubmitting || isSuccess}
                      sx={{
                        bgcolor: isSuccess ? 'success.main' : 'primary.main',
                        '&:hover': {
                          bgcolor: isSuccess ? 'success.dark' : 'primary.dark',
                        }
                      }}
                    >
                      {isSuccess ? 'Created Successfully' : 'Create Election'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
      
      {/* Loading backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting && !isSuccess}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>Saving election to blockchain...</Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default AddElection; 