// In Recorder.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useMeeting } from '../../context/MeetingContext';
import { Box, Typography, IconButton } from '@mui/material';
import { MicIcon, StopIcon } from '@mui/icons-material';
import AudioVisualizer from './AudioVisualizer';

const Recorder = () => {
  // Get these values and functions from useMeeting
  const { 
    isRecording, 
    startMeeting, 
    endMeeting, 
    previewStream,
    mediaRecorderStatus
  } = useMeeting();
  
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);
  
  // Log for debugging
  console.log("Recorder: Current isRecording state:", isRecording);
  console.log("Recorder: Current mediaRecorderStatus:", mediaRecorderStatus);
  
  // Timer for recording duration
  useEffect(() => {
    console.log("Recorder: useEffect triggered, isRecording:", isRecording);
    
    if (isRecording) {
      console.log("Recorder: Starting timer");
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      console.log("Recorder: Clearing timer");
      clearInterval(timerRef.current);
    }

    return () => {
      console.log("Recorder: Cleanup - clearing timer");
      clearInterval(timerRef.current);
    };
  }, [isRecording]);
  
  // Handle start recording
  const handleStartRecording = () => {
    console.log("Recorder: handleStartRecording called");
    setRecordingTime(0);
    startMeeting();
  };

  // Handle stop recording
  const handleStopRecording = () => {
    console.log("Recorder: handleStopRecording called");
    endMeeting();
  };
  
  // Format time display (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box>
      {/* Audio Visualizer */}
      <AudioVisualizer stream={previewStream} isRecording={isRecording} />
      
      {/* Timer */}
      <Typography variant="h3" align="center">
        {formatTime(recordingTime)}
      </Typography>
      
      {/* Recording Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        {!isRecording ? (
          <IconButton
            color="primary"
            size="large"
            onClick={handleStartRecording}
            disabled={mediaRecorderStatus === 'acquiring_media'}
            sx={{ 
              p: 2, 
              bgcolor: 'primary.main', 
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            <MicIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton
            color="error"
            size="large"
            onClick={handleStopRecording}
            sx={{ 
              p: 2, 
              bgcolor: 'error.main', 
              color: 'white',
              '&:hover': {
                bgcolor: 'error.dark',
              }
            }}
          >
            <StopIcon fontSize="large" />
          </IconButton>
        )}
      </Box>
      
      {/* Status display for debugging */}
      <Typography variant="caption" align="center" display="block" sx={{ mt: 2 }}>
        Status: {mediaRecorderStatus}
      </Typography>
    </Box>
  );
};

export default Recorder;