import { useState, useEffect, useCallback } from 'react';
import { useGlobalAudio } from '../context/AudioContext';

/**
 * Custom hook for managing voice narration in the E-Voting system
 * Uses global audio context to prevent overlap when navigating between pages
 */
const useVoiceNarration = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  
  // Use global audio context with global play-once tracking
  const { 
    isPlaying, 
    currentAudio, 
    currentStep, 
    hasPlayedOnce,
    playGlobalAudio, 
    stopGlobalAudio, 
    isAudioPlaying,
    hasStepBeenPlayed,
    markStepAsPlayed,
    resetPlayedAudio
  } = useGlobalAudio();

  // Audio file mappings for different voting steps
  const audioFiles = {
    landing: '/audio/step1_landing.mp3',
    camera: '/audio/step2_camera.mp3',
    confirm: '/audio/step3_confirm.mp3',
    vote: '/audio/step4_vote.mp3',
    verify: '/audio/step5_verify.mp3',
    thankyou: '/audio/step6_thankyou.mp3'
  };

  /**
   * Play voice narration for a specific step
   * @param {string} step - The voting step (landing, camera, confirm, vote, verify, thankyou)
   * @param {boolean} autoPlay - Whether to play automatically (default: true)
   * @param {boolean} forcePlay - Force play even if already played once (default: false)
   */
  const playVoiceGuide = useCallback((step, autoPlay = true, forcePlay = false) => {
    console.log(`🎧 Playing audio for step: ${step} (autoPlay: ${autoPlay}, forcePlay: ${forcePlay})`);
    
    if (!isEnabled || !audioFiles[step]) {
      console.warn(`Voice narration disabled or audio file not found for step: ${step}`);
      return;
    }

    // Check if already played once and not forcing replay
    if (!forcePlay && hasStepBeenPlayed(step)) {
      console.log(`⏭️ Skipping ${step} - already played once`);
      return;
    }

    // Prevent multiple simultaneous audio playback
    if (isAudioPlaying()) {
      console.log(`⏸️ Stopping current audio before playing ${step}`);
      stopGlobalAudio();
    }

    try {
      console.log(`🚀 Starting playback for ${step}`);
      // Play using global audio manager
      playGlobalAudio(audioFiles[step], step);
      
      // Mark as played
      markStepAsPlayed(step);
      
    } catch (error) {
      console.error(`Failed to play voice narration for ${step}:`, error);
    }
  }, [isEnabled, audioFiles, hasStepBeenPlayed, playGlobalAudio, stopGlobalAudio, isAudioPlaying, markStepAsPlayed]);

  /**
   * Stop currently playing voice narration
   */
  const stopVoiceGuide = useCallback(() => {
    stopGlobalAudio();
  }, [stopGlobalAudio]);

  /**
   * Toggle voice narration on/off
   */
  const toggleVoiceNarration = useCallback(() => {
    setIsEnabled(prev => {
      const newState = !prev;
      if (!newState) {
        stopGlobalAudio();
      }
      localStorage.setItem('voiceNarrationEnabled', JSON.stringify(newState));
      return newState;
    });
  }, [stopGlobalAudio]);

  /**
   * Replay current voice narration (force play)
   */
  const replayVoiceGuide = useCallback(() => {
    if (currentStep) {
      playVoiceGuide(currentStep, true, true); // Force replay
    }
  }, [currentStep, playVoiceGuide]);

  /**
   * Reset played audio tracking (for testing purposes)
   */
  const resetPlayedAudioLocal = useCallback(() => {
    resetPlayedAudio();
  }, [resetPlayedAudio]);

  // Load voice narration preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('voiceNarrationEnabled');
    if (savedPreference !== null) {
      setIsEnabled(JSON.parse(savedPreference));
    }
  }, []);

  // Stop audio when component unmounts or page changes
  useEffect(() => {
    return () => {
      // Don't stop global audio on unmount as it should persist across pages
      // Only stop if user explicitly disables voice narration
    };
  }, []);

  return {
    isPlaying,
    isEnabled,
    currentAudio: currentStep, // Return current step instead of audio path
    hasPlayedOnce, // Already an array from global context
    playVoiceGuide,
    stopVoiceGuide,
    toggleVoiceNarration,
    replayVoiceGuide,
    resetPlayedAudio: resetPlayedAudioLocal,
    audioFiles
  };
};

export default useVoiceNarration; 