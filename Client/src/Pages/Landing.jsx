import React, { useContext } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Stack,
  Grid,
  Paper,
  useTheme,
  alpha,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PollIcon from '@mui/icons-material/Poll';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GavelIcon from '@mui/icons-material/Gavel';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import VoiceControl from '../Components/VoiceControl';
import evotingImage from '../img/E-voting.png';
import { useGlobalAudio } from "../context/AudioContext";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);
const MotionCard = motion(Card);
const MotionChip = motion(Chip);

const Landing = () => {
  const theme = useTheme();
  const { mode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { resetPlayedAudio } = useGlobalAudio();

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Blockchain Security',
      titleHindi: 'ब्लॉकचेन सुरक्षा',
      description: 'Votes recorded on Ethereum blockchain for maximum security and transparency'
    },
    {
      icon: <GavelIcon sx={{ fontSize: 40 }} />,
      title: 'Constitutional Compliance',
      titleHindi: 'संवैधानिक अनुपालन',
      description: 'Adheres to Election Commission of India guidelines and constitutional provisions'
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
      title: 'Voter Authentication',
      titleHindi: 'मतदाता प्रमाणीकरण',
      description: 'Aadhaar-based verification ensures only eligible citizens participate'
    },
    {
      icon: <VisibilityIcon sx={{ fontSize: 40 }} />,
      title: 'Transparent Process',
      titleHindi: 'पारदर्शी प्रक्रिया',
      description: 'Real-time results with complete auditability as per democratic principles'
    }
  ];

  // Indian flag colors
  const saffron = '#FF9933';
  const white = '#FFFFFF';
  const green = '#138808';
  const navy = '#000080';

  return (
    <Box sx={{ overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
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
            Blockchain-Based Electronic Voting System | ब्लॉकचेन आधारित इलेक्ट्रॉनिक मतदान प्रणाली
          </Typography>
        </Container>
      </Box>

      {/* Disclaimer Section */}
      <Box sx={{ 
        backgroundColor: '#ffebee',
        borderLeft: `4px solid #f44336`,
        py: 2,
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Typography variant="body1" sx={{ color: '#c62828', fontWeight: 'bold', mb: 1 }}>
            ⚠️ DISCLAIMER | अस्वीकरण ⚠️
          </Typography>
          <Typography variant="body2" sx={{ color: '#d32f2f', lineHeight: 1.6 }}>
            This is NOT an official system authorized by the Government of India or Election Commission of India. 
            This is purely an academic/educational project for demonstration purposes only.
          </Typography>
          <Typography variant="body2" sx={{ color: '#d32f2f', mt: 1, lineHeight: 1.6 }}>
            यह भारत सरकार या भारत निर्वाचन आयोग द्वारा अधिकृत कोई आधिकारिक प्रणाली नहीं है। 
            यह केवल शैक्षणिक/शिक्षा परियोजना है और केवल प्रदर्शन के उद्देश्य से है।
          </Typography>
        </Container>
      </Box>

      {/* National Emblem Style Section */}
      <Box sx={{ 
        backgroundColor: white,
        borderBottom: `4px solid ${saffron}`,
        py: 3
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: navy, mb: 1 }}>
              🏛️ राष्ट्रीय ई-मतदान पोर्टल
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ color: navy }}>
              National E-Voting Portal
            </Typography>
            <Typography variant="body1" sx={{ color: green, fontWeight: 'bold', mt: 1 }}>
              सत्यमेव जयते | Truth Alone Triumphs
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Hero Section with Indian Design */}
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${alpha(saffron, 0.1)} 0%, ${alpha(green, 0.1)} 100%)`,
          pt: 8,
          pb: 12,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative Ashoka Chakra inspired circles */}
        <Box sx={{ 
          position: 'absolute', 
          top: 50, 
          left: 50, 
          width: 150, 
          height: 150, 
          borderRadius: '50%', 
          border: `3px solid ${alpha(navy, 0.1)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            border: `2px solid ${alpha(saffron, 0.3)}`,
          }
        }} />
        <Box sx={{ 
          position: 'absolute', 
          bottom: 50, 
          right: 50, 
          width: 120, 
          height: 120, 
          borderRadius: '50%', 
          border: `3px solid ${alpha(green, 0.2)}`,
        }} />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  <MotionChip 
                    label="भारत सरकार | Government of India"
                    sx={{ 
                      backgroundColor: saffron, 
                      color: white,
                      fontWeight: 'bold'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  />
                </Stack>
                
              <MotionTypography 
                variant="h2" 
                component="h1" 
                fontWeight="800"
                  sx={{ color: navy, mb: 2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                  Digital India
                </MotionTypography>
                
                <MotionTypography 
                  variant="h3" 
                  component="h2" 
                  fontWeight="700"
                  sx={{ color: green, mb: 3 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  Blockchain E-Voting
              </MotionTypography>
                
              <MotionTypography 
                  variant="h6" 
                  sx={{ mb: 4, color: navy, fontWeight: 500 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                  सुरक्षित, पारदर्शी और छेड़छाड़-रहित मतदान प्रणाली<br/>
                  Secure, transparent, and tamper-proof voting system
              </MotionTypography>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                    spacing={3}
                  sx={{ mb: 6 }}
                >
                  <MotionButton 
                    component={Link}
                    to="/elections" 
                    variant="contained" 
                    size="large" 
                    sx={{ 
                        py: 2, 
                        px: 5,
                        bgcolor: saffron,
                        color: white,
                      fontWeight: 'bold',
                        fontSize: '1.1rem',
                      '&:hover': {
                          bgcolor: alpha(saffron, 0.8),
                      }
                    }}
                    startIcon={<HowToVoteIcon />}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                      चुनाव देखें | View Elections
                  </MotionButton>
                </Stack>
                </MotionBox>
              </MotionBox>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Paper
                  elevation={12}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: `linear-gradient(145deg, ${white} 0%, ${alpha(saffron, 0.05)} 100%)`,
                    border: `3px solid ${alpha(navy, 0.1)}`,
                    position: 'relative',
                    width: '100%',
                    maxWidth: 500,
                    minHeight: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      background: `linear-gradient(45deg, ${saffron}, ${green})`,
                      borderRadius: 'inherit',
                      zIndex: -1,
                    }
                  }}
                >
                  {/* Indian Election Themed Visual */}
                  <Box sx={{ 
                    width: '100%', 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {/* Ashoka Chakra Background */}
                    <Box sx={{
                      position: 'absolute',
                      top: '10%',
                      right: '10%',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      border: `3px solid ${alpha(navy, 0.1)}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        width: '60%',
                        height: '60%',
                        borderRadius: '50%',
                        border: `2px solid ${alpha(saffron, 0.3)}`,
                      }
                    }} />

                    {/* Main Ballot Box */}
                    <Box sx={{
                      width: 180,
                      height: 120,
                      background: `linear-gradient(145deg, ${navy} 0%, ${alpha(navy, 0.8)} 100%)`,
                      borderRadius: 3,
                      position: 'relative',
                      mb: 3,
                      boxShadow: `0 8px 24px ${alpha(navy, 0.3)}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&::before': {
                        content: '"🗳️"',
                        fontSize: '3rem',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }
                    }}>
                      {/* Ballot Slot */}
                      <Box sx={{
                        position: 'absolute',
                        top: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 100,
                        height: 8,
                        background: `linear-gradient(90deg, ${saffron}, ${white}, ${green})`,
                        borderRadius: 1,
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                      }} />
                    </Box>

                    {/* Digital Elements */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 3
                    }}>
                      {/* Blockchain Symbol */}
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: `linear-gradient(45deg, ${saffron}, ${alpha(saffron, 0.7)})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: white,
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        boxShadow: `0 4px 12px ${alpha(saffron, 0.4)}`
                      }}>
                        ⛓️
                      </Box>
                      
                      {/* Connection Lines */}
                      <Box sx={{
                        width: 30,
                        height: 2,
                        background: `linear-gradient(90deg, ${saffron}, ${green})`,
                        borderRadius: 1
                      }} />
                      
                      {/* Security Symbol */}
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: `linear-gradient(45deg, ${green}, ${alpha(green, 0.7)})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: white,
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        boxShadow: `0 4px 12px ${alpha(green, 0.4)}`
                      }}>
                        🔒
                      </Box>
                    </Box>

                    {/* Indian Election Labels */}
                    <Box sx={{ 
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ 
                        color: navy, 
                        mb: 1,
                        textShadow: `0 2px 4px ${alpha(navy, 0.2)}`
                      }}>
                        भारतीय चुनाव
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" sx={{ 
                        color: green, 
                        mb: 2,
                        textShadow: `0 2px 4px ${alpha(green, 0.2)}`
                      }}>
                        INDIAN ELECTIONS
                      </Typography>
                      
                      {/* Technology Badge */}
                      <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 3,
                        py: 1,
                        borderRadius: 20,
                        background: `linear-gradient(90deg, ${alpha(saffron, 0.1)}, ${alpha(green, 0.1)})`,
                        border: `1px solid ${alpha(navy, 0.2)}`,
                        mb: 2
                      }}>
                        <Typography variant="body2" fontWeight="600" sx={{ color: navy }}>
                          🔗 Blockchain Powered
                        </Typography>
                      </Box>

                      {/* Indian Government Emblem Style */}
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1,
                        mt: 2
                      }}>
                        <Box sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: saffron
                        }} />
                        <Typography variant="body2" sx={{ 
                          color: navy, 
                          fontWeight: 'bold',
                          fontSize: '0.75rem'
                        }}>
                          डिजिटल इंडिया | DIGITAL INDIA
                        </Typography>
                        <Box sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: green
                        }} />
                      </Box>
                    </Box>

                    {/* Decorative Indian Flag Corner */}
                    <Box sx={{
                      position: 'absolute',
                      bottom: 10,
                      left: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1
                    }}>
                      <Box sx={{ width: 30, height: 3, backgroundColor: saffron, borderRadius: 1 }} />
                      <Box sx={{ width: 30, height: 3, backgroundColor: white, borderRadius: 1, border: `1px solid ${alpha(navy, 0.2)}` }} />
                      <Box sx={{ width: 30, height: 3, backgroundColor: green, borderRadius: 1 }} />
                    </Box>

                    {/* Floating Elements */}
                    <MotionBox
                      sx={{
                        position: 'absolute',
                        top: '20%',
                        left: '15%',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: alpha(saffron, 0.3),
                      }}
                      animate={{ 
                        y: [0, -10, 0],
                        opacity: [0.3, 0.7, 0.3]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    <MotionBox
                      sx={{
                        position: 'absolute',
                        bottom: '30%',
                        right: '20%',
                        width: 15,
                        height: 15,
                        borderRadius: '50%',
                        backgroundColor: alpha(green, 0.3),
                      }}
                      animate={{ 
                        y: [0, 10, 0],
                        opacity: [0.3, 0.7, 0.3]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    />
                  </Box>
                </Paper>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section with Indian Government Style */}
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <MotionTypography 
            variant="h3" 
            textAlign="center" 
            fontWeight="bold" 
            sx={{ color: navy, mb: 2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            मुख्य विशेषताएं | Key Features
          </MotionTypography>
          
          <MotionTypography 
            variant="body1" 
            textAlign="center" 
            sx={{ color: 'text.secondary', mb: 6, maxWidth: 800, mx: 'auto' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            भारतीय लोकतंत्र के लिए अत्याधुनिक प्रौद्योगिकी | Cutting-edge technology for Indian democracy
          </MotionTypography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionCard
                  sx={{ 
                    height: '100%', 
                    borderRadius: 3,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    border: `2px solid ${alpha(saffron, 0.2)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: saffron,
                      transform: 'translateY(-8px)',
                    }
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      mb: 3,
                      color: navy
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: navy, mb: 1 }}>
                      {feature.titleHindi}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: green, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Government Banner Section */}
        <Box sx={{ 
          backgroundColor: alpha(navy, 0.05), 
          borderRadius: 4, 
          p: 6, 
          mb: 8,
          border: `2px solid ${alpha(saffron, 0.3)}`
        }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: navy, mb: 2 }}>
                🇮🇳 डिजिटल इंडिया पहल | Digital India Initiative
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                भारत सरकार के डिजिटल इंडिया कार्यक्रम के अंतर्गत विकसित यह प्रणाली लोकतांत्रिक प्रक्रिया को 
                और भी पारदर्शी और सुरक्षित बनाती है।
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Developed under the Government of India's Digital India program, this system makes 
                the democratic process more transparent and secure.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <AccountBalanceIcon sx={{ fontSize: 80, color: saffron, mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: navy }}>
                संविधान सम्मत
              </Typography>
              <Typography variant="body2" sx={{ color: green, fontWeight: 'bold' }}>
                Constitutional Compliant
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Admin Access Section with Indian Government Style */}
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: alpha(green, 0.05),
          borderRadius: 4,
          border: `2px solid ${alpha(green, 0.2)}`
        }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: navy, mb: 2 }}>
            🏛️ प्रशासनिक पहुंच | Administrator Access
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
            चुनाव आयोग के अधिकारियों और प्रशासकों के लिए। चुनाव प्रबंधन, उम्मीदवार पंजीकरण और विस्तृत विश्लेषण।
            <br/>
            For Election Commission officials and administrators. Manage elections, candidate registration and detailed analytics.
          </Typography>
          <MotionButton
            component={Link}
            to="/admin" 
            variant="contained"
            size="large"
            sx={{ 
              py: 2.5, 
              px: 6,
              bgcolor: green,
              color: white,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              borderRadius: 3,
              '&:hover': {
                bgcolor: alpha(green, 0.8),
              }
            }}
            startIcon={<AdminPanelSettingsIcon />}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            प्रशासक पोर्टल | Admin Portal
          </MotionButton>
        </Box>
      </Container>

      {/* Footer with Indian Government Style */}
      <Box sx={{ 
        backgroundColor: navy,
        color: white,
        py: 4,
        mt: 8
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                भारत निर्वाचन आयोग
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Election Commission of India<br/>
                निर्वाचन सदन, अशोक रोड, नई दिल्ली - 110001<br/>
                Nirvachan Sadan, Ashoka Road, New Delhi - 110001
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                Powered by Blockchain Technology
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                ब्लॉकचेन प्रौद्योगिकी द्वारा संचालित
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, borderColor: alpha(white, 0.2) }} />
          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.8 }}>
            © 2024 भारत सरकार | Government of India. All rights reserved. | सभी अधिकार सुरक्षित।
          </Typography>
        </Container>
      </Box>

      {/* Voice Narration Control */}
      <VoiceControl 
        step="landing" 
        autoPlay={true} 
        variant="floating" 
        showLabel={true}
      />
    </Box>
  );
};

export default Landing;