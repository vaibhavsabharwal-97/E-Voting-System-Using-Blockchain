import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

/**
 * Global Audio Context for managing voice narration across the entire application
 * Prevents audio overlap when navigating between pages
 */
const AudioContext = createContext();

export const useGlobalAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useGlobalAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(new Set()); // Global play-once tracking
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);

  /**
   * Stop any currently playing audio globally
   */
  const stopGlobalAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // Remove all event listeners using stored handlers
      if (audioRef.current._handleCanPlayThrough) {
        audioRef.current.removeEventListener('canplaythrough', audioRef.current._handleCanPlayThrough);
      }
      if (audioRef.current._handlePlay) {
        audioRef.current.removeEventListener('play', audioRef.current._handlePlay);
      }
      if (audioRef.current._handlePause) {
        audioRef.current.removeEventListener('pause', audioRef.current._handlePause);
      }
      if (audioRef.current._handleAudioEnded) {
        audioRef.current.removeEventListener('ended', audioRef.current._handleAudioEnded);
      }
      if (audioRef.current._handleAudioError) {
        audioRef.current.removeEventListener('error', audioRef.current._handleAudioError);
      }
      
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentAudio(null);
    setCurrentStep(null);
    isPlayingRef.current = false;
  }, []);

  /**
   * Handle audio ended event
   */
  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentAudio(null);
    setCurrentStep(null);
    isPlayingRef.current = false;
  }, []);

  /**
   * Handle audio error event
   */
  const handleAudioError = useCallback((error) => {
    console.error('Global audio error:', error);
    setIsPlaying(false);
    setCurrentAudio(null);
    setCurrentStep(null);
    isPlayingRef.current = false;
  }, []);

  /**
   * Play audio globally (stops any previous audio)
   */
  const playGlobalAudio = useCallback((audioPath, step) => {
    // Stop any currently playing audio first
    stopGlobalAudio();

    try {
      const audio = new Audio(audioPath);
      audioRef.current = audio;
      setCurrentAudio(audioPath);
      setCurrentStep(step);

      // Set audio properties
      audio.volume = 0.8;
      audio.preload = 'auto';

      // Named event handlers for proper cleanup
      const handleCanPlayThrough = () => {
        audio.play().then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
        }).catch(error => {
          console.error(`Failed to play global audio for ${step}:`, error);
          setIsPlaying(false);
          isPlayingRef.current = false;
        });
        // Remove listener after first fire to prevent multiple plays
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      };

      const handlePlay = () => {
        setIsPlaying(true);
        isPlayingRef.current = true;
      };

      const handlePause = () => {
        setIsPlaying(false);
        isPlayingRef.current = false;
      };

      // Store handlers on audio element for cleanup
      audio._handleCanPlayThrough = handleCanPlayThrough;
      audio._handlePlay = handlePlay;
      audio._handlePause = handlePause;
      audio._handleAudioEnded = handleAudioEnded;
      audio._handleAudioError = handleAudioError;

      // Add event listeners
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleAudioEnded);
      audio.addEventListener('error', handleAudioError);

    } catch (error) {
      console.error(`Failed to initialize global audio for ${step}:`, error);
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  }, [stopGlobalAudio, handleAudioEnded, handleAudioError]);

  /**
   * Check if audio is currently playing
   */
  const isAudioPlaying = useCallback(() => {
    return isPlayingRef.current;
  }, []);

  /**
   * Check if a step has been played once
   */
  const hasStepBeenPlayed = useCallback((step) => {
    return hasPlayedOnce.has(step);
  }, [hasPlayedOnce]);

  /**
   * Mark a step as played
   */
  const markStepAsPlayed = useCallback((step) => {
    setHasPlayedOnce(prev => new Set([...prev, step]));
  }, []);

  /**
   * Reset all played audio tracking
   */
  const resetPlayedAudio = useCallback(() => {
    setHasPlayedOnce(new Set());
  }, []);

  const value = {
    isPlaying,
    currentAudio,
    currentStep,
    hasPlayedOnce: Array.from(hasPlayedOnce),
    playGlobalAudio,
    stopGlobalAudio,
    isAudioPlaying,
    hasStepBeenPlayed,
    markStepAsPlayed,
    resetPlayedAudio
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}; 