import React, { useContext } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  useTheme,
  Paper,
  Stack,
  CardMedia,
  Divider,
  alpha
} from '@mui/material';
import { Link } from 'react-router-dom';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ThemeContext } from '../context/ThemeContext';
import MainNavbar from "../Components/User/MainNavbar";

const Home = () => {
  const theme = useTheme();
  const { mode } = useContext(ThemeContext);

  const features = [
    {
      icon: <HowToVoteIcon sx={{ fontSize: 48 }} />,
      title: 'Secure Voting',
      description: 'Cast your vote securely using blockchain technology, ensuring your vote is counted accurately and cannot be tampered with.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48 }} />,
      title: 'Blockchain Security',
      description: 'Every vote is recorded on the Ethereum blockchain, making the process transparent, secure, and immutable.'
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 48 }} />,
      title: 'Identity Verification',
      description: 'Advanced facial recognition and secure authentication ensure only registered voters can participate.'
    },
    {
      icon: <VisibilityIcon sx={{ fontSize: 48 }} />,
      title: 'Real-time Results',
      description: 'View election results in real-time as votes are tallied, ensuring complete transparency in the election process.'
    }
  ];

  return (
    <Box>
      <MainNavbar />
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: mode === 'dark' ? 'background.paper' : alpha(theme.palette.primary.main, 0.03),
          py: 8, 
          borderRadius: { xs: 0, md: 4 },
          mb: 6,
          mt: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                fontWeight="800"
                color="primary"
                gutterBottom
              >
                Secure E-Voting
              </Typography>
              <Typography 
                variant="h5" 
                color="textSecondary" 
                sx={{ mb: 4 }}
              >
                Vote securely with blockchain technology
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ mb: 4, maxWidth: '90%' }}
              >
                Our electronic voting system leverages blockchain technology to ensure secure, 
                transparent, and tamper-proof elections. Your vote is secure, anonymous, and verifiable.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  size="large"
                  component={Link}
                  to="/election"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontWeight: 'bold',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Vote Now
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={mode === 'dark' 
                  ? "https://img.freepik.com/free-vector/blockchain-technology-background_1017-16282.jpg" 
                  : "https://img.freepik.com/free-vector/abstract-blockchain-blue-background_1017-16280.jpg"}
                alt="E-Voting Illustration"
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                  transform: { xs: 'scale(1)', md: 'scale(1.05)' },
                  transition: 'transform 0.5s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h3" 
            component="h2" 
            fontWeight="bold"
            gutterBottom
          >
            Our Features
          </Typography>
          <Typography 
            variant="body1" 
            color="textSecondary"
            sx={{ maxWidth: 700, mx: 'auto' }}
          >
            Our blockchain-based e-voting system provides multiple layers of security 
            and transparency to ensure fair and tamper-proof elections.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 2,
                      color: theme.palette.primary.main
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box 
        sx={{ 
          bgcolor: mode === 'dark' ? 'background.paper' : alpha(theme.palette.primary.main, 0.03),
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography 
              variant="h3" 
              component="h2" 
              fontWeight="bold"
              gutterBottom
            >
              How It Works
            </Typography>
            <Typography 
              variant="body1" 
              color="textSecondary"
              sx={{ maxWidth: 700, mx: 'auto' }}
            >
              Our secure e-voting process combines multiple authentication methods 
              with blockchain technology for maximum security.
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {[
              { 
                step: '01', 
                title: 'Register & Verify', 
                description: 'Create an account and verify your identity through our secure verification process.' 
              },
              { 
                step: '02', 
                title: 'Choose Election', 
                description: 'Select from available active elections that you are eligible to participate in.' 
              },
              { 
                step: '03', 
                title: 'Cast Your Vote', 
                description: 'Select your candidate and complete the authentication process to cast your vote.' 
              },
              { 
                step: '04', 
                title: 'Blockchain Confirmation', 
                description: 'Your vote is recorded on the blockchain, ensuring it cannot be altered or deleted.' 
              },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    borderRadius: 4,
                    position: 'relative',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      backgroundColor: theme.palette.primary.main,
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4,
                    }
                  }}
                >
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 15, 
                      opacity: 0.1,
                      fontWeight: 'bold',
                      color: theme.palette.primary.main
                    }}
                  >
                    {item.step}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ mb: 8, textAlign: 'center' }}>
        <Paper
          sx={{
            p: 6,
            borderRadius: 4,
            backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Ready to Vote?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Participate in active elections and make your voice heard.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/election"
            sx={{
              bgcolor: 'white',
              color: theme.palette.primary.main,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: alpha('white', 0.9),
              }
            }}
          >
            Vote Now
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
