// In Recorder.jsx
import React, { useState, useEffect, useRef } from "react";
import { useMeeting } from "../../context/MeetingContext";
import { Box, Typography, IconButton } from "@mui/material";
import { MicIcon, StopIcon } from "@mui/icons-material";
import AudioVisualizer from "./AudioVisualizer";

const Recorder = () => {
  // Get these values and functions from useMeeting
  const {
    isRecording,
    startMeeting,
    endMeeting,
    previewStream,
    mediaRecorderStatus,
  } = useMeeting();

  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setRecordingTime(0);
    startMeeting();
  };

  const handleStopRecording = () => {
    endMeeting();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Box>
      <AudioVisualizer stream={previewStream} isRecording={isRecording} />

      <Typography variant="h3" align="center">
        {formatTime(recordingTime)}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        {!isRecording ? (
          <IconButton
            color="primary"
            size="large"
            onClick={handleStartRecording}
            disabled={mediaRecorderStatus === "acquiring_media"}
            sx={{
              p: 2,
              bgcolor: "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
              },
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
              bgcolor: "error.main",
              color: "white",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <StopIcon fontSize="large" />
          </IconButton>
        )}
      </Box>

      <Typography
        variant="caption"
        align="center"
        display="block"
        sx={{ mt: 2 }}
      >
        Status: {mediaRecorderStatus}
      </Typography>
    </Box>
  );
};

export default Recorder;
