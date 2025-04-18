/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { VolumeUp } from "@mui/icons-material";

const AudioVisualizer = ({ stream, isRecording }) => {
  const [visualData, setVisualData] = useState([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    if (stream && isRecording) {
      setupAudioVisualizer();
      return () => cleanupAudioVisualizer();
    } else {
      cleanupAudioVisualizer();
    }
  }, [stream, isRecording]);

  const setupAudioVisualizer = () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;

        if (stream) {
          sourceRef.current =
            audioContextRef.current.createMediaStreamSource(stream);
          sourceRef.current.connect(analyserRef.current);
        }

        startVisualization();
      } catch (error) {
        console.error("Error setting up audio visualizer:", error);
      }
    }
  };

  const startVisualization = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVisualizer = () => {
      if (!analyserRef.current || !isRecording) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      const samples = 32;
      const sampledData = [];
      const sampleSize = Math.floor(bufferLength / samples);

      for (let i = 0; i < samples; i++) {
        const startIndex = i * sampleSize;
        let sum = 0;
        for (let j = 0; j < sampleSize; j++) {
          sum += dataArray[startIndex + j] || 0;
        }
        sampledData.push(Math.floor(sum / sampleSize));
      }

      setVisualData(sampledData);
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    updateVisualizer();
  };

  const cleanupAudioVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current
        .close()
        .catch((err) => console.error("Error closing audio context:", err));
      audioContextRef.current = null;
      analyserRef.current = null;
    }

    if (!isRecording) {
      setVisualData([]);
    }
  };

  if (!visualData.length) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          minHeight: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: `${theme.palette.primary.main}10`,
          borderRadius: 2,
          border: `1px dashed ${theme.palette.primary.main}40`,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          display="flex"
          alignItems="center"
          gap={1}
        >
          <VolumeUp color="inherit" />
          {isRecording ? "Initializing..." : "Ready to record"}
        </Typography>
      </Box>
    );
  }

  const getBarColor = (value) => {
    if (value > 200) return theme.palette.error.main;
    if (value > 150) return theme.palette.warning.main;
    if (value > 75) return theme.palette.primary.main;
    return `${theme.palette.primary.main}80`;
  };

  const barWidth = visualData.length > 40 ? 2 : visualData.length > 20 ? 4 : 8;
  const gap = visualData.length > 40 ? 1 : visualData.length > 20 ? 2 : 4;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 120,
        backgroundColor: `${theme.palette.primary.main}10`,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 1,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isRecording && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: theme.palette.error.main,
            boxShadow: `0 0 10px ${theme.palette.error.main}`,
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": { opacity: 0.6, transform: "scale(1)" },
              "50%": { opacity: 1, transform: "scale(1.2)" },
              "100%": { opacity: 0.6, transform: "scale(1)" },
            },
            m: 2,
          }}
        />
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80%",
          width: "100%",
          gap: `${gap}px`,
        }}
      >
        {visualData.map((value, index) => (
          <Box
            key={index}
            sx={{
              width: barWidth,
              height: `${Math.max(5, (value / 255) * 100)}%`,
              backgroundColor: getBarColor(value),
              borderRadius: "2px",
              transition: "height 0.05s ease-out, background-color 0.1s ease",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AudioVisualizer;
