import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Chip, 
  Button,
  Avatar,
  Card,
  CardContent,
  Divider,
  Stack
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { serverLink } from '../../Data/Variables';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const User = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(serverLink + 'user/' + id);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography>Loading user data...</Typography>
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography color="error">User not found</Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/users')}
            sx={{ mt: 2 }}
          >
            Back to Users
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
            onClick={() => navigate('/admin/users')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" fontWeight="bold">
            User Profile
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Avatar
                  src={user.avatar}
                  alt={user.username}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                />
                <Typography variant="h5" fontWeight="bold">
                  {user.fname} {user.lname}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  @{user.username}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={user.isAdmin ? 'Administrator' : 'Regular User'} 
                    color={user.isAdmin ? 'primary' : 'default'} 
                    sx={{ mt: 1 }}
                  />
                </Box>
              </CardContent>
              <Divider />
              <Box sx={{ p: 2 }}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={() => navigate(`/admin/users/${id}/edit`)}
                >
                  Edit Profile
                </Button>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  User Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Stack spacing={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Username
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography>{user.username}</Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Full Name
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography>{user.fname} {user.lname}</Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Email
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography>{user.email}</Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Mobile
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography>{user.mobile}</Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Location
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography>{user.location}</Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        User Role
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography>{user.isAdmin ? 'Administrator' : 'Regular User'}</Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Joined
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography>{new Date(user.createdAt).toLocaleDateString()}</Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default User; 