/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useMeeting } from "../context/MeetingContext";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Divider,
  alpha,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  Mic as MicIcon,
  Info as InfoIcon,
  Notes,
} from "@mui/icons-material";
import ProcessingUI from "../components/NewMeeting/ProcessingUI";
import RecordButton from "../components/NewMeeting/RecordButton";
import SoundWave from "../components/NewMeeting/SoundWave";
import Timer from "../components/NewMeeting/Timer";

const NewMeeting = () => {
  const {
    isRecording,
    mediaRecorderStatus,
    startMeeting,
    endMeeting,
    transcribeMeetingAudio,
    generateAndSaveMeeting,
    transcription,
    isTranscribing,
    isGeneratingMinutes,
    loading,
    error,
    audioBlob,
  } = useMeeting();

  const [recordingTime, setRecordingTime] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [meetingTitle, setMeetingTitle] = useState("");
  const theme = useTheme();
  const timerRef = useRef(null);
  const waveFrequencyRef = useRef(1.5);
  const waveAmplitudeRef = useRef(20);
  const hasTransitionedToStep1 = useRef(false);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const toggleRecording = () => {

    if (!isRecording && mediaRecorderStatus !== "acquiring_media") {
      setRecordingTime(0);
      hasTransitionedToStep1.current = false;
      startMeeting();
    } else if (isRecording) {
      endMeeting();

    }
  };

  useEffect(() => {


    if (
      mediaRecorderStatus === "stopped" &&
      activeStep === 0 &&
      !hasTransitionedToStep1.current
    ) {

      setActiveStep(1);
      hasTransitionedToStep1.current = true;
    }

    if (mediaRecorderStatus === "idle" && activeStep !== 0) {
      console.log(
        "NewMeeting/Status Effect: Status is idle, resetting activeStep to 0"
      );

    }
  }, [mediaRecorderStatus]);

  useEffect(() => {
    console.log(
      `NewMeeting/Transcription Trigger Check: Step=${activeStep}, Blob=${!!audioBlob}, Transcr=${!!transcription}, isTranscribing=${isTranscribing}, Error='${error}'`
    );
    const transcriptionErrorExists =
      error && error.startsWith("Transcription failed");

    if (
      activeStep === 1 &&
      audioBlob &&
      !transcription &&
      !isTranscribing &&
      !transcriptionErrorExists
    ) {
      console.log(
        "NewMeeting/Transcription Trigger: Conditions met. Calling transcribeMeetingAudio..."
      );
      transcribeMeetingAudio();
    }
  }, [
    activeStep,
    audioBlob,
    transcription,
    isTranscribing,
    error,
    transcribeMeetingAudio,
  ]);

  const handleGenerateAndSave = async () => {
    if (!meetingTitle.trim()) {
      console.warn("NewMeeting/handleGenerateAndSave: Meeting title is empty.");
      return;
    }
    await generateAndSaveMeeting(meetingTitle);
  };

  const isProcessingMinutes = isGeneratingMinutes || loading;

  const processingError =
    error &&
      !error.startsWith("Transcription failed") &&
      !error.startsWith("Recording Error")
      ? error
      : null;

  const recordingError =
    error &&
    (mediaRecorderStatus === "error" || error.startsWith("Recording Error"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        background: theme.palette.background.default,
        pb: 8,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: `radial-gradient(circle at 20% 30%, ${alpha(
            theme.palette.primary.main,
            0.07
          )} 0%, transparent 70%)`,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, pt: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBack />}
            sx={{ mb: 2 }}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Box sx={{ mb: 6, textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${theme.palette.primary.main} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {activeStep === 0 ? "Record Your Meeting" : "Process & Review"}
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {activeStep === 0
                ? "Click the microphone to start recording"
                : "Review transcription and generate minutes"}
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              "& .MuiStepConnector-line": {
                borderTopWidth: 3,
                borderRadius: 1,
              },
              "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
                borderColor: theme.palette.primary.main,
              },
              "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
                borderColor: theme.palette.primary.main,
              },
              "& .MuiStepLabel-label.Mui-active": {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
            }}
          >
            <Step>
              <StepLabel
                StepIconProps={{
                  sx: {
                    "&.Mui-active": { color: theme.palette.primary.main },
                    "&.Mui-completed": { color: theme.palette.primary.main },
                  },
                }}
              >
                Record
              </StepLabel>
            </Step>
            <Step>
              <StepLabel
                StepIconProps={{
                  sx: {
                    "&.Mui-active": { color: theme.palette.primary.main },
                    "&.Mui-completed": { color: theme.palette.primary.main },
                  },
                }}
              >
                Process & Review
              </StepLabel>
            </Step>
          </Stepper>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", minHeight: 400 }}>
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.div
                key="recorder"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%", maxWidth: 600 }}
              >
                <Card
                  elevation={8}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    boxShadow: "0 15px 50px rgba(0,0,0,0.08)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      opacity: 0.03,
                      background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
                      zIndex: 0,
                    }}
                  />
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Box
                      sx={{
                        mb: 4,
                        height: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: theme.palette.divider,
                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                      }}
                    >
                      <SoundWave
                        isRecording={isRecording}
                        frequency={waveFrequencyRef.current}
                        amplitude={waveAmplitudeRef.current}
                      />
                    </Box>
                    <Timer seconds={recordingTime} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 140,
                      }}
                    >
                      <Box sx={{ textAlign: "center" }}>
                        <Box sx={{ mb: 2 }}>
                          <RecordButton
                            isRecording={isRecording}
                            onClick={toggleRecording}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          {isRecording
                            ? "Tap to stop recording"
                            : "Tap to start recording"}
                        </Typography>
                        {mediaRecorderStatus === "acquiring_media" && (
                          <Typography variant="caption" color="text.secondary">
                            Requesting microphone...
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    {!isRecording && recordingTime === 0 && (
                      <Box sx={{ mt: 4 }}>
                        {" "}
                        <Divider sx={{ my: 2 }} />{" "}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            mt: 2,
                          }}
                        >
                          {" "}
                          <InfoIcon
                            sx={{
                              mr: 1.5,
                              color: theme.palette.info.main,
                              mt: 0.5,
                              fontSize: 20,
                            }}
                          />{" "}
                          <Box>
                            {" "}
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              gutterBottom
                            >
                              {" "}
                              Tips for better quality{" "}
                            </Typography>{" "}
                            <Typography variant="body2" color="text.secondary">
                              {" "}
                              Minimize background noise and speak clearly.{" "}
                            </Typography>{" "}
                          </Box>{" "}
                        </Box>{" "}
                      </Box>
                    )}
                    {recordingError && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {recordingError}
                      </Alert>
                    )}
                  </Box>
                </Card>
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div
                key="processor"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%", maxWidth: 700 }}
              >
                <Box>
                  <Card
                    sx={{
                      borderRadius: 4,
                      mb: 4,
                      boxShadow: "0 10px 40px rgba(0,0,0,0.07)",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Notes sx={{ mr: 1, color: "primary.main" }} />{" "}
                          Transcription Result
                        </Typography>
                      </Box>

                      {isTranscribing && (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                          <CircularProgress />
                          <Typography sx={{ mt: 1 }} color="text.secondary">
                            Transcribing audio...
                          </Typography>
                        </Box>
                      )}

                      {error &&
                        !isTranscribing &&
                        error.startsWith("Transcription failed") && (
                          <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                          </Alert>
                        )}

                      {transcription && !isTranscribing && (
                        <Box
                          sx={{
                            maxHeight: 300,
                            overflowY: "auto",
                            p: 2,
                            background: alpha(theme.palette.grey[500], 0.05),
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: "pre-wrap",
                              fontFamily: "monospace",
                            }}
                          >
                            {transcription}
                          </Typography>
                        </Box>
                      )}

                      {!transcription &&
                        !isTranscribing &&
                        !error &&
                        audioBlob && (
                          <Typography
                            sx={{ textAlign: "center", py: 4 }}
                            color="text.secondary"
                          >
                            Waiting for transcription...
                          </Typography>
                        )}
                      {!audioBlob && !isTranscribing && (
                        <Typography
                          sx={{ textAlign: "center", py: 4 }}
                          color="text.secondary"
                        >
                          No audio recording found. Please record again.
                        </Typography>
                      )}
                    </CardContent>
                  </Card>

                  {transcription &&
                    !isTranscribing &&
                    !error?.startsWith("Transcription failed") && (
                      <ProcessingUI
                        meetingTitle={meetingTitle}
                        setMeetingTitle={setMeetingTitle}
                        onProcess={handleGenerateAndSave}
                        isLoading={isProcessingMinutes}
                        currentError={processingError}
                      />
                    )}

                  <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Button
                      onClick={() => {
                        setActiveStep(0);
                        setRecordingTime(0);
                      }}
                      color="inherit"
                      startIcon={<MicIcon />}
                      disabled={isTranscribing || isProcessingMinutes}
                    >
                      Record Again
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Container>
    </Box>
  );
};

export default NewMeeting;
