import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { serverLink } from '../../Data/Variables';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CakeIcon from '@mui/icons-material/Cake';

const Candidate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch candidate details by ID instead of username
        const response = await axios.get(serverLink + 'candidate/id/' + id);
        setCandidate(response.data);
        
        // Fetch all elections to find which ones this candidate is in
        const electionsResponse = await axios.get(serverLink + 'elections');
        const allElections = electionsResponse.data;
        
        // Filter elections that include this candidate
        const candidateElections = allElections.filter(
          election => election.candidates && election.candidates.includes(id)
        );
        
        setElections(candidateElections);
      } catch (error) {
        console.error('Error fetching candidate data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getAge = (dateString) => {
    if (!dateString) return '';
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'init':
        return 'info';
      case 'voting':
        return 'success';
      case 'result':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography>Loading candidate data...</Typography>
        </Box>
      </Container>
    );
  }

  if (!candidate) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography color="error">Candidate not found</Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/candidates')}
            sx={{ mt: 2 }}
          >
            Back to Candidates
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 2, pb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/admin/candidates')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" fontWeight="bold">
            Candidate Profile
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Avatar
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
                >
                  <PersonIcon sx={{ fontSize: 60 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="bold">
                  {candidate.firstName} {candidate.lastName || ''}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  @{candidate.username}
                </Typography>
                <Chip 
                  icon={<LocationOnIcon fontSize="small" />}
                  label={candidate.location} 
                  color="primary" 
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </CardContent>
              <Divider />
              <Box sx={{ p: 2 }}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/admin/candidates/${id}/edit`)}
                >
                  Edit Candidate
                </Button>
              </Box>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Elections
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {elections.length > 0 ? (
                  <List disablePadding>
                    {elections.map((election, index) => (
                      <ListItem 
                        key={index} 
                        divider={index !== elections.length - 1}
                        sx={{ px: 1 }}
                        button
                        onClick={() => navigate(`/admin/elections/${election._id}`)}
                      >
                        <ListItemText 
                          primary={election.name} 
                          secondary={
                            <Chip 
                              label={election.currentPhase.charAt(0).toUpperCase() + election.currentPhase.slice(1)} 
                              color={getPhaseColor(election.currentPhase)} 
                              size="small"
                              sx={{ mt: 0.5 }}
                            />
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography color="text.secondary">
                      Not participating in any elections
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Candidate Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Stack spacing={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Full Name
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography>{candidate.firstName} {candidate.lastName || ''}</Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Username
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography>{candidate.username}</Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <CakeIcon sx={{ mr: 1, fontSize: 20 }} />
                        Date of Birth
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography>
                        {formatDate(candidate.dob)} ({getAge(candidate.dob)} years old)
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <SchoolIcon sx={{ mr: 1, fontSize: 20 }} />
                        Qualification
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography>{candidate.qualification}</Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <WorkIcon sx={{ mr: 1, fontSize: 20 }} />
                        Years of Experience
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography>{candidate.join} years</Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon sx={{ mr: 1, fontSize: 20 }} />
                        Location
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography>{candidate.location}</Typography>
                    </Grid>
                  </Grid>

                  {candidate.description && (
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                          Description
                        </Typography>
                        <Card variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                          <Typography variant="body2">
                            {candidate.description}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Candidate; 