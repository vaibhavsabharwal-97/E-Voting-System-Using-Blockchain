import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Fab,
  Typography,
  Stack,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  VolumeUp,
  VolumeOff,
  Replay,
  Stop,
  PlayArrow,
  Pause,
  CheckCircle
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import useVoiceNarration from '../hooks/useVoiceNarration';
import { useGlobalAudio } from '../context/AudioContext';

const MotionBox = motion(Box);
const MotionFab = motion(Fab);

/**
 * Voice Control Component for E-Voting System
 * Provides audio narration controls with accessibility features
 */
const VoiceControl = ({ 
  step, 
  autoPlay = true, 
  position = 'fixed', 
  showLabel = true,
  variant = 'floating' // 'floating' or 'inline'
}) => {
  const theme = useTheme();
  const location = useLocation();
  const { stopGlobalAudio, hasStepBeenPlayed } = useGlobalAudio();
  const autoPlayAttempted = React.useRef(false);
  const {
    isPlaying,
    isEnabled,
    currentAudio,
    hasPlayedOnce,
    playVoiceGuide,
    stopVoiceGuide,
    toggleVoiceNarration,
    replayVoiceGuide
  } = useVoiceNarration();

  // Check if current step has been played using global function
  const stepHasBeenPlayed = step ? hasStepBeenPlayed(step) : false;

  // Reset auto-play attempt when step changes
  React.useEffect(() => {
    autoPlayAttempted.current = false;
  }, [step]);

  // Stop audio when location changes (page navigation)
  React.useEffect(() => {
    return () => {
      // Stop global audio when component unmounts due to navigation
      if (isPlaying) {
        stopGlobalAudio();
      }
    };
  }, [location.pathname, isPlaying, stopGlobalAudio]);

  // Auto-play voice narration when component mounts (only once)
  React.useEffect(() => {
    console.log(`🎯 VoiceControl useEffect: step=${step}, autoPlay=${autoPlay}, enabled=${isEnabled}, hasBeenPlayed=${stepHasBeenPlayed}, attempted=${autoPlayAttempted.current}`);
    
    if (step && autoPlay && isEnabled && !stepHasBeenPlayed && !autoPlayAttempted.current) {
      console.log(`⏰ Setting auto-play timer for ${step}`);
      autoPlayAttempted.current = true;
      
      const timer = setTimeout(() => {
        // Double-check that the step hasn't been played by another component
        if (!hasStepBeenPlayed(step)) {
          console.log(`🎯 Executing auto-play for ${step}`);
          playVoiceGuide(step, true, false); // Don't force play on auto-play
        } else {
          console.log(`🎯 Skipping auto-play for ${step} - already played by another component`);
        }
      }, 1000); // Delay to ensure page is loaded
      
      return () => {
        console.log(`🧹 Cleaning up timer for ${step}`);
        clearTimeout(timer);
      };
    } else {
      console.log(`🚫 Not setting auto-play timer for ${step}`);
    }
  }, [step, autoPlay, isEnabled, stepHasBeenPlayed, playVoiceGuide, variant]);

  const handlePlayPause = () => {
    if (isPlaying) {
      stopVoiceGuide();
    } else if (step) {
      // Force play when user manually clicks
      playVoiceGuide(step, true, true);
    }
  };

  const handleReplay = () => {
    if (step) {
      // Always force play on replay
      playVoiceGuide(step, true, true);
    } else {
      replayVoiceGuide();
    }
  };

  // Floating variant (fixed position)
  if (variant === 'floating') {
    return (
      <MotionBox
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        sx={{
          position: position,
          bottom: 24,
          right: 24,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'center'
        }}
      >
        {/* Voice Status Indicator */}
        {showLabel && (
          <Chip
            label={
              isPlaying 
                ? "🔊 सुन रहे हैं | Listening" 
                : stepHasBeenPlayed
                  ? "✅ सुना गया | Played"
                  : isEnabled 
                    ? "🎵 आवाज़ सक्रिय | Voice Active"
                    : "🔇 आवाज़ बंद | Voice Off"
            }
            size="small"
            sx={{
              backgroundColor: isPlaying 
                ? theme.palette.success.main 
                : stepHasBeenPlayed
                  ? theme.palette.info.main
                  : isEnabled 
                    ? theme.palette.primary.main 
                    : theme.palette.grey[500],
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              animation: isPlaying ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.7 },
                '100%': { opacity: 1 }
              }
            }}
          />
        )}

        {/* Main Control Buttons */}
        <Stack direction="row" spacing={1}>
          {/* Play/Pause Button */}
          <MotionFab
            size="medium"
            color="primary"
            onClick={handlePlayPause}
            disabled={!step}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              backgroundColor: isPlaying ? theme.palette.warning.main : theme.palette.primary.main,
              '&:hover': {
                backgroundColor: isPlaying ? theme.palette.warning.dark : theme.palette.primary.dark,
              }
            }}
          >
            <Tooltip title={isPlaying ? "रोकें | Stop" : "सुनें | Listen"}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </Tooltip>
          </MotionFab>

          {/* Replay Button */}
          <MotionFab
            size="medium"
            color="secondary"
            onClick={handleReplay}
            disabled={!step}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Tooltip title="दोबारा सुनें | Replay">
              <Replay />
            </Tooltip>
          </MotionFab>

          {/* Toggle Voice Button */}
          <MotionFab
            size="medium"
            color={isEnabled ? "success" : "default"}
            onClick={toggleVoiceNarration}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              backgroundColor: isEnabled ? theme.palette.success.main : theme.palette.grey[400],
              '&:hover': {
                backgroundColor: isEnabled ? theme.palette.success.dark : theme.palette.grey[600],
              }
            }}
          >
            <Tooltip title={isEnabled ? "आवाज़ बंद करें | Turn Off Voice" : "आवाज़ चालू करें | Turn On Voice"}>
              {isEnabled ? <VolumeUp /> : <VolumeOff />}
            </Tooltip>
          </MotionFab>
        </Stack>
      </MotionBox>
    );
  }

  // Inline variant
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        mb: 2
      }}
    >
      {/* Voice Guide Label */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold" color="primary">
          🎵 आवाज़ गाइड | Voice Guide
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {isPlaying 
            ? "निर्देश सुन रहे हैं... | Listening to instructions..."
            : stepHasBeenPlayed
              ? "निर्देश सुना गया | Instructions played"
              : "निर्देश सुनने के लिए प्ले दबाएं | Press play to hear instructions"
          }
        </Typography>
        {stepHasBeenPlayed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <CheckCircle sx={{ fontSize: 14, color: theme.palette.success.main }} />
            <Typography variant="caption" sx={{ color: theme.palette.success.main, fontWeight: 'bold' }}>
              Played Once | एक बार चलाया गया
            </Typography>
          </Box>
        )}
      </Box>

      {/* Control Buttons */}
      <Stack direction="row" spacing={1}>
        <IconButton
          onClick={handlePlayPause}
          disabled={!step}
          color={isPlaying ? "warning" : "primary"}
          size="small"
        >
          <Tooltip title={isPlaying ? "रोकें | Stop" : "सुनें | Listen"}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </Tooltip>
        </IconButton>

        <IconButton
          onClick={handleReplay}
          disabled={!step}
          color="secondary"
          size="small"
        >
          <Tooltip title="दोबारा सुनें | Replay">
            <Replay />
          </Tooltip>
        </IconButton>

        <IconButton
          onClick={toggleVoiceNarration}
          color={isEnabled ? "success" : "default"}
          size="small"
        >
          <Tooltip title={isEnabled ? "आवाज़ बंद करें | Turn Off Voice" : "आवाज़ चालू करें | Turn On Voice"}>
            {isEnabled ? <VolumeUp /> : <VolumeOff />}
          </Tooltip>
        </IconButton>
      </Stack>
    </Box>
  );
};

export default VoiceControl; 