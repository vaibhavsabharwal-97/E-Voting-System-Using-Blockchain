import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  VolumeUp,
  PlayArrow,
  Home,
  CameraAlt,
  VerifiedUser,
  HowToVote,
  Security,
  ThumbUp
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import VoiceControl from '../Components/VoiceControl';
import useVoiceNarration from '../hooks/useVoiceNarration';

const MotionCard = motion(Card);

const VoiceDemo = () => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState('landing');
  const { playVoiceGuide, isPlaying, isEnabled, hasPlayedOnce, resetPlayedAudio } = useVoiceNarration();

  // Indian flag colors
  const saffron = '#FF9933';
  const white = '#FFFFFF';
  const green = '#138808';
  const navy = '#000080';

  const voiceSteps = [
    {
      id: 'landing',
      title: 'Landing Page',
      titleHindi: 'मुख्य पृष्ठ',
      icon: <Home sx={{ fontSize: 40 }} />,
      description: 'Welcome message and system introduction',
      descriptionHindi: 'स्वागत संदेश और सिस्टम परिचय',
      audioFile: 'step1_landing.mp3',
      content: 'Welcome to the E-Voting System. Please click on Election to cast a vote. ई-वोटिंग सिस्टम में आपका स्वागत है। वोट देने के लिए Election पर क्लिक करें।'
    },
    {
      id: 'camera',
      title: 'Camera Recognition',
      titleHindi: 'कैमरा पहचान',
      icon: <CameraAlt sx={{ fontSize: 40 }} />,
      description: 'Face recognition camera instructions',
      descriptionHindi: 'चेहरा पहचान कैमरा निर्देश',
      audioFile: 'step2_camera.mp3',
      content: 'Please look at the camera. कृपया कैमरे की ओर देखें।'
    },
    {
      id: 'confirm',
      title: 'Identity Confirmation',
      titleHindi: 'पहचान पुष्टि',
      icon: <VerifiedUser sx={{ fontSize: 40 }} />,
      description: 'Confirm recognized identity',
      descriptionHindi: 'पहचानी गई पहचान की पुष्टि करें',
      audioFile: 'step3_confirm.mp3',
      content: 'Confirm your identity by clicking Confirm or Not Me. कृपया Confirm या Not Me पर क्लिक करके अपनी पहचान की पुष्टि करें।'
    },
    {
      id: 'vote',
      title: 'Voting Process',
      titleHindi: 'मतदान प्रक्रिया',
      icon: <HowToVote sx={{ fontSize: 40 }} />,
      description: 'Cast vote for preferred candidate',
      descriptionHindi: 'पसंदीदा उम्मीदवार को वोट दें',
      audioFile: 'step4_vote.mp3',
      content: 'Cast your vote for your preferred candidate in this election. For casting a vote, click on the Vote button. अपने पसंदीदा उम्मीदवार को वोट दें। वोट देने के लिए Vote बटन पर क्लिक करें।'
    },
    {
      id: 'verify',
      title: 'Vote Verification',
      titleHindi: 'वोट सत्यापन',
      icon: <Security sx={{ fontSize: 40 }} />,
      description: 'Secure voting authentication',
      descriptionHindi: 'सुरक्षित मतदान प्रमाणीकरण',
      audioFile: 'step5_verify.mp3',
      content: 'Please Click on the Vote Button for Secure Voting. कृपया Vote बटन पर क्लिक करके सुरक्षित वोट दें।'
    },
    {
      id: 'thankyou',
      title: 'Thank You',
      titleHindi: 'धन्यवाद',
      icon: <ThumbUp sx={{ fontSize: 40 }} />,
      description: 'Vote confirmation and thanks',
      descriptionHindi: 'वोट पुष्टि और धन्यवाद',
      audioFile: 'step6_thankyou.mp3',
      content: 'Please confirm to cast your vote. Thank you. वोट डालने के लिए कृपया पुष्टि करें। धन्यवाद।'
    }
  ];

  const handleStepChange = (stepId) => {
    setCurrentStep(stepId);
    playVoiceGuide(stepId);
  };

  const currentStepData = voiceSteps.find(step => step.id === currentStep);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header */}
      <Box sx={{ 
        background: `linear-gradient(90deg, ${saffron} 0%, ${white} 50%, ${green} 100%)`,
        height: '6px'
      }} />
      
      <Box sx={{ 
        backgroundColor: navy,
        color: white,
        py: 3,
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            🎵 Voice Narration Demo
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            आवाज़ गाइड डेमो | Voice Guide Demo
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
            E-Voting System Audio Guidance | ई-वोटिंग सिस्टम ऑडियो मार्गदर्शन
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Current Step Display */}
        <Paper sx={{ 
          p: 4, 
          mb: 4,
          background: `linear-gradient(135deg, ${alpha(saffron, 0.1)} 0%, ${alpha(green, 0.1)} 100%)`,
          border: `2px solid ${alpha(navy, 0.2)}`,
          borderRadius: 3
        }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 2,
              color: navy
            }}>
              {currentStepData?.icon}
            </Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: navy, mb: 1 }}>
              {currentStepData?.titleHindi}
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ color: green, mb: 2 }}>
              {currentStepData?.title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, maxWidth: 800, mx: 'auto' }}>
              {currentStepData?.descriptionHindi} | {currentStepData?.description}
            </Typography>
            
            {/* Voice Control for Current Step */}
            <VoiceControl 
              step={currentStep} 
              autoPlay={false} 
              variant="inline" 
              showLabel={true}
            />
          </Box>

          {/* Audio Content Display */}
          <Paper sx={{ 
            p: 3, 
            backgroundColor: white,
            border: `1px solid ${alpha(saffron, 0.3)}`,
            borderRadius: 2
          }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: navy, mb: 2 }}>
              📝 Audio Content | ऑडियो सामग्री
            </Typography>
            <Typography variant="body1" sx={{ 
              lineHeight: 1.8,
              fontSize: '1.1rem',
              color: 'text.primary'
            }}>
              {currentStepData?.content}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                label={`🎵 ${currentStepData?.audioFile}`}
                size="small"
                sx={{ 
                  backgroundColor: alpha(green, 0.1),
                  color: green,
                  fontWeight: 'bold'
                }}
              />
              <Chip 
                label={isEnabled ? "🔊 Voice Enabled" : "🔇 Voice Disabled"}
                size="small"
                sx={{ 
                  backgroundColor: isEnabled ? alpha(saffron, 0.1) : alpha('#666', 0.1),
                  color: isEnabled ? saffron : '#666',
                  fontWeight: 'bold'
                }}
              />
              {isPlaying && (
                <Chip 
                  label="▶️ Playing"
                  size="small"
                  sx={{ 
                    backgroundColor: alpha('#4caf50', 0.1),
                    color: '#4caf50',
                    fontWeight: 'bold',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.7 },
                      '100%': { opacity: 1 }
                    }
                  }}
                />
              )}
              {hasPlayedOnce.includes(currentStep) && (
                <Chip 
                  label="✅ Played Once"
                  size="small"
                  sx={{ 
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    fontWeight: 'bold'
                  }}
                />
              )}
            </Box>
            
            {/* Reset Button for Testing */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={resetPlayedAudio}
                sx={{
                  borderColor: '#ff6b6b',
                  color: '#ff6b6b',
                  '&:hover': {
                    borderColor: '#ff6b6b',
                    backgroundColor: alpha('#ff6b6b', 0.1)
                  }
                }}
              >
                🔄 Reset Played Status | स्थिति रीसेट करें
              </Button>
            </Box>
          </Paper>
        </Paper>

        {/* Step Selection Grid */}
        <Typography variant="h5" fontWeight="bold" sx={{ color: navy, mb: 3, textAlign: 'center' }}>
          🎯 Select Voting Step | चरण चुनें
        </Typography>
        
        <Grid container spacing={3}>
          {voiceSteps.map((step, index) => (
            <Grid item xs={12} sm={6} md={4} key={step.id}>
              <MotionCard
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: currentStep === step.id ? `3px solid ${saffron}` : `2px solid ${alpha(navy, 0.1)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                    borderColor: saffron
                  },
                  position: 'relative'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleStepChange(step.id)}
              >
                {/* Played Once Indicator */}
                {hasPlayedOnce.includes(step.id) && (
                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: theme.palette.success.main,
                    color: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 1
                  }}>
                    ✓
                  </Box>
                )}
                
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: 2,
                    color: currentStep === step.id ? saffron : navy
                  }}>
                    {step.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: navy, mb: 1 }}>
                    {step.titleHindi}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: green, mb: 2 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {step.descriptionHindi}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {step.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant={currentStep === step.id ? "contained" : "outlined"}
                    startIcon={<PlayArrow />}
                    sx={{
                      backgroundColor: currentStep === step.id ? saffron : 'transparent',
                      borderColor: currentStep === step.id ? saffron : navy,
                      color: currentStep === step.id ? white : navy,
                      '&:hover': {
                        backgroundColor: currentStep === step.id ? alpha(saffron, 0.8) : alpha(saffron, 0.1),
                        borderColor: saffron
                      }
                    }}
                  >
                    Play Audio
                  </Button>
                </CardActions>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: navy, mb: 3, textAlign: 'center' }}>
            🌟 Voice Narration Features | आवाज़ गाइड सुविधाएं
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <VolumeUp sx={{ fontSize: 48, color: saffron, mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: navy, mb: 1 }}>
                  Bilingual Support
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ color: green, mb: 2 }}>
                  द्विभाषी समर्थन
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hindi and English voice guidance for all voting steps
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Security sx={{ fontSize: 48, color: green, mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: navy, mb: 1 }}>
                  Accessibility
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ color: green, mb: 2 }}>
                  पहुंच योग्यता
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Helps visually impaired and elderly voters navigate the system
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <VerifiedUser sx={{ fontSize: 48, color: navy, mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: navy, mb: 1 }}>
                  User Control
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ color: green, mb: 2 }}>
                  उपयोगकर्ता नियंत्रण
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Play, pause, replay, and toggle voice narration as needed
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Floating Voice Control */}
      <VoiceControl 
        step={currentStep} 
        autoPlay={false} 
        variant="floating" 
        showLabel={true}
      />
    </Box>
  );
};

export default VoiceDemo; 