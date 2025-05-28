import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Chip, 
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  ButtonGroup,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { serverLink, phases } from '../../Data/Variables';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';

const Election = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const response = await axios.get(serverLink + 'election/' + id);
        setElection(response.data);
        
        // Fetch candidate details if the election has candidates
        if (response.data.candidates && response.data.candidates.length > 0) {
          const candidatePromises = response.data.candidates.map(
            candidateId => axios.get(serverLink + 'candidate/id/' + candidateId)
          );
          const candidateResponses = await Promise.all(candidatePromises);
          const candidateData = candidateResponses.map(response => response.data);
          setCandidates(candidateData);
        }
      } catch (error) {
        console.error('Error fetching election data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchElectionData();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePhaseChange = async (phase) => {
    try {
      await axios.post(serverLink + 'phase/edit/' + id, { phase });
      // Refresh election data
      const response = await axios.get(serverLink + 'election/' + id);
      setElection(response.data);
    } catch (error) {
      console.error('Error changing election phase:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography>Loading election data...</Typography>
        </Box>
      </Container>
    );
  }

  if (!election) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography color="error">Election not found</Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/elections')}
            sx={{ mt: 2 }}
          >
            Back to Elections
          </Button>
        </Box>
      </Container>
    );
  }

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

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 2, pb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/admin/elections')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" fontWeight="bold">
            Election Details
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 2
                  }}
                >
                  <HowToVoteIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" fontWeight="bold">
                  {election.name}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={election.currentPhase.charAt(0).toUpperCase() + election.currentPhase.slice(1)} 
                    color={getPhaseColor(election.currentPhase)} 
                    sx={{ mt: 1 }}
                  />
                </Box>
              </CardContent>
              <Divider />
              <Box sx={{ p: 2 }}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/admin/elections/${id}/edit`)}
                  sx={{ mb: 2 }}
                >
                  Edit Election
                </Button>
                
                <Typography variant="subtitle2" gutterBottom>
                  Change Election Phase
                </Typography>
                <ButtonGroup fullWidth variant="outlined">
                  {phases.map((phase) => (
                    <Button 
                      key={phase}
                      onClick={() => handlePhaseChange(phase)}
                      variant={election.currentPhase === phase ? 'contained' : 'outlined'}
                      disabled={election.currentPhase === phase}
                    >
                      {phase.charAt(0).toUpperCase() + phase.slice(1)}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    <GroupIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Candidates
                  </Typography>
                  <Chip label={candidates.length} color="primary" />
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                {candidates.length > 0 ? (
                  <List disablePadding>
                    {candidates.map((candidate, index) => (
                      <ListItem 
                        key={index} 
                        divider={index !== candidates.length - 1}
                        sx={{ px: 0 }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={`${candidate.firstName} ${candidate.lastName || ''}`}
                          secondary={candidate.username}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography color="text.secondary">
                      No candidates in this election
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="election tabs"
                >
                  <Tab label="Details" />
                  <Tab label="Results" />
                  <Tab label="Votes" />
                </Tabs>
              </Box>
              
              <CardContent>
                {tabValue === 0 && (
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Election Information
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Stack spacing={3}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Election Name
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Typography>{election.name}</Typography>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Current Phase
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Chip 
                            label={election.currentPhase.charAt(0).toUpperCase() + election.currentPhase.slice(1)}
                            color={getPhaseColor(election.currentPhase)}
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Number of Candidates
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Typography>{candidates.length}</Typography>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Election ID
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Typography sx={{ wordBreak: 'break-all' }}>{election._id}</Typography>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Box>
                )}
                
                {tabValue === 1 && (
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Election Results
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    {election.currentPhase === 'result' ? (
                      <Typography>Results are available in the Results section</Typography>
                    ) : (
                      <Typography color="text.secondary">
                        Results will be available once the election moves to the result phase.
                      </Typography>
                    )}
                  </Box>
                )}
                
                {tabValue === 2 && (
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Voting Activity
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Typography>
                      Voting data is stored on the blockchain for privacy and security.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Election; 