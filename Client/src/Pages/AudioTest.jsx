import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  Alert,
  Chip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  VolumeUp,
  VolumeOff,
  Refresh
} from '@mui/icons-material';
import useVoiceNarration from '../hooks/useVoiceNarration';

const AudioTest = () => {
  const theme = useTheme();
  const {
    isPlaying,
    isEnabled,
    currentAudio,
    hasPlayedOnce,
    playVoiceGuide,
    stopVoiceGuide,
    toggleVoiceNarration,
    resetPlayedAudio,
    audioFiles
  } = useVoiceNarration();

  const [testResults, setTestResults] = useState({});

  const testAudioFile = async (step) => {
    try {
      setTestResults(prev => ({ ...prev, [step]: 'testing' }));
      
      // Test if audio file exists
      const audio = new Audio(audioFiles[step]);
      
      audio.addEventListener('canplaythrough', () => {
        setTestResults(prev => ({ ...prev, [step]: 'success' }));
      });
      
      audio.addEventListener('error', () => {
        setTestResults(prev => ({ ...prev, [step]: 'error' }));
      });
      
      // Try to load the audio
      audio.load();
      
    } catch (error) {
      setTestResults(prev => ({ ...prev, [step]: 'error' }));
    }
  };

  const testAllAudioFiles = () => {
    Object.keys(audioFiles).forEach(step => {
      testAudioFile(step);
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return theme.palette.success.main;
      case 'error': return theme.palette.error.main;
      case 'testing': return theme.palette.warning.main;
      default: return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'testing': return '⏳';
      default: return '⚪';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
        🔧 Audio System Test
      </Typography>
      <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Test and debug the voice narration system
      </Typography>

      {/* System Status */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          📊 System Status
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Chip
            label={`Voice: ${isEnabled ? 'Enabled' : 'Disabled'}`}
            color={isEnabled ? 'success' : 'default'}
            icon={isEnabled ? <VolumeUp /> : <VolumeOff />}
          />
          <Chip
            label={`Playing: ${isPlaying ? 'Yes' : 'No'}`}
            color={isPlaying ? 'warning' : 'default'}
            icon={<PlayArrow />}
          />
          <Chip
            label={`Current: ${currentAudio || 'None'}`}
            color="info"
          />
          <Chip
            label={`Played: ${hasPlayedOnce.length} files`}
            color="secondary"
          />
        </Stack>
        
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<VolumeUp />}
            onClick={toggleVoiceNarration}
            sx={{ mr: 2 }}
          >
            Toggle Voice
          </Button>
          <Button
            variant="outlined"
            startIcon={<Stop />}
            onClick={stopVoiceGuide}
            disabled={!isPlaying}
            sx={{ mr: 2 }}
          >
            Stop Audio
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={resetPlayedAudio}
          >
            Reset Played Status
          </Button>
        </Box>
      </Paper>

      {/* Audio File Tests */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          🎵 Audio File Tests
        </Typography>
        <Button
          variant="contained"
          onClick={testAllAudioFiles}
          sx={{ mb: 3 }}
        >
          Test All Audio Files
        </Button>
        
        <Stack spacing={2}>
          {Object.entries(audioFiles).map(([step, filePath]) => (
            <Box
              key={step}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 1,
                backgroundColor: alpha(getStatusColor(testResults[step]), 0.05)
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {getStatusIcon(testResults[step])} {step.toUpperCase()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filePath}
                </Typography>
                {hasPlayedOnce.includes(step) && (
                  <Chip
                    label="Played Once"
                    size="small"
                    color="info"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => testAudioFile(step)}
                >
                  Test
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => playVoiceGuide(step, true, true)}
                  disabled={!isEnabled}
                >
                  Play
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Debug Information */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          🐛 Debug Information
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Audio Files Location:</strong> /public/audio/<br/>
            <strong>Expected Files:</strong> step1_landing.mp3, step2_camera.mp3, step3_confirm.mp3, step4_vote.mp3, step5_verify.mp3, step6_thankyou.mp3<br/>
            <strong>Play Once Feature:</strong> Each audio file will only auto-play once per session. Use "Force Play" or "Replay" to play again.
          </Typography>
        </Alert>
        
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Played Audio Files:
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {hasPlayedOnce.length > 0 ? hasPlayedOnce.join(', ') : 'None'}
        </Typography>
        
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Test Results:
        </Typography>
        <pre style={{ 
          fontSize: '12px', 
          backgroundColor: alpha(theme.palette.grey[100], 0.5),
          padding: '8px',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          {JSON.stringify(testResults, null, 2)}
        </pre>
      </Paper>
    </Container>
  );
};

export default AudioTest; 