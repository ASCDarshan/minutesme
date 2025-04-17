import React, { useState, useEffect, useRef } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useMeeting } from "../context/MeetingContext";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Tooltip,
  Zoom,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Paper,
  alpha,
  SvgIcon,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  Mic as MicIcon,
  Stop as StopIcon,
  Delete as DeleteIcon,
  CheckCircleOutline,
  Info as InfoIcon,
  Lightbulb,
  InsertDriveFile,
  BrightnessMedium,
  Settings,
  Notes,
} from "@mui/icons-material";

// --- PASTE SoundWave, RecordButton, Timer, ProcessingUI components here ---
const SoundWave = ({ isRecording, frequency = 1.5, amplitude = 20 }) => {
  const theme = useTheme();
  const bars = 32;
  const controls = useAnimation();
  useEffect(() => {
    if (isRecording) {
      controls.start((i) => ({
        height: [
          `${5 + Math.random() * amplitude}px`,
          `${15 + Math.random() * amplitude * 1.5}px`,
          `${5 + Math.random() * amplitude}px`,
        ],
        backgroundColor: [
          theme.palette.primary.light,
          theme.palette.primary.main,
          theme.palette.primary.light,
        ],
        transition: {
          duration: 1 + Math.random() * frequency,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: i * 0.08,
        },
      }));
    } else {
      controls.start({
        height: "5px",
        backgroundColor: theme.palette.primary.light,
        transition: { duration: 0.5 },
      });
    }
  }, [isRecording, controls, amplitude, frequency, theme]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 80,
        width: "100%",
      }}
    >
      {" "}
      {[...Array(bars)].map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          animate={controls}
          style={{
            width: "6px",
            height: "5px",
            margin: "0 2px",
            borderRadius: "4px",
            backgroundColor: theme.palette.primary.light,
          }}
        />
      ))}{" "}
    </Box>
  );
};
const RecordButton = ({ isRecording, onClick, size = 80 }) => {
  const theme = useTheme();
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      {" "}
      <IconButton
        onClick={onClick}
        sx={{
          width: size,
          height: size,
          bgcolor: isRecording ? "error.main" : "primary.main",
          color: "white",
          transition: "all 0.3s ease",
          position: "relative",
          "&:hover": { bgcolor: isRecording ? "error.dark" : "primary.dark" },
          boxShadow: `0 8px 20px ${isRecording
            ? alpha(theme.palette.error.main, 0.5)
            : alpha(theme.palette.primary.main, 0.5)
            }`,
        }}
      >
        {" "}
        {isRecording ? (
          <StopIcon sx={{ fontSize: size / 3 }} />
        ) : (
          <MicIcon sx={{ fontSize: size / 3 }} />
        )}{" "}
      </IconButton>{" "}
      {isRecording && (
        <>
          {" "}
          {[...Array(3)].map((_, i) => (
            <Box
              component={motion.div}
              key={i}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: size,
                height: size,
                borderRadius: "50%",
                border: `2px solid ${theme.palette.error.main}`,
              }}
              initial={{ opacity: 0.7, scale: 1, x: "-50%", y: "-50%" }}
              animate={{ opacity: 0, scale: 2 + i * 0.5, x: "-50%", y: "-50%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeOut",
              }}
            />
          ))}{" "}
        </>
      )}{" "}
    </motion.div>
  );
};
const Timer = ({ seconds }) => {
  const theme = useTheme();
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  return (
    <Box sx={{ textAlign: "center", my: 2 }}>
      {" "}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {" "}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontFamily: "monospace",
            color: seconds > 0 ? "error.main" : "text.primary",
          }}
        >
          {" "}
          {formatTime(seconds)}{" "}
        </Typography>{" "}
      </motion.div>{" "}
    </Box>
  );
};
const ProcessingUI = ({
  onProcess,
  meetingTitle,
  setMeetingTitle,
  isLoading,
  currentError,
}) => {
  const theme = useTheme();
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const gradientBorder = {
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 3,
      padding: "2px",
      background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.secondary.main})`,
      WebkitMask:
        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
    },
  };
  return (
    <Card
      sx={{
        borderRadius: 4,
        overflow: "visible",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        position: "relative",
        ...gradientBorder,
      }}
    >
      {" "}
      <CardContent sx={{ p: 4 }}>
        {" "}
        <Typography variant="h5" fontWeight={600} align="center" gutterBottom>
          {" "}
          Generate Minutes{" "}
        </Typography>{" "}
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          {" "}
          Enter a title and generate the final meeting minutes.{" "}
        </Typography>{" "}
        {currentError && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {" "}
            {currentError}{" "}
          </Alert>
        )}{" "}
        <Box sx={{ mb: 4 }}>
          {" "}
          <TextField
            fullWidth
            label="Meeting Title"
            variant="outlined"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="E.g., Weekly Team Sync, Product Planning"
            disabled={isLoading}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />{" "}
        </Box>{" "}
        <motion.div
          whileHover={{ scale: isLoading ? 1 : 1.03 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          onHoverStart={() => setIsButtonHovered(true)}
          onHoverEnd={() => setIsButtonHovered(false)}
        >
          {" "}
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={onProcess}
            disabled={!meetingTitle.trim() || isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Settings />
              )
            }
            sx={{
              py: 1.5,
              borderRadius: 3,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {" "}
            <Box
              component={motion.div}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)",
                zIndex: 0,
              }}
              initial={{ x: "-100%" }}
              animate={{ x: isButtonHovered && !isLoading ? "100%" : "-100%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />{" "}
            <Box sx={{ position: "relative", zIndex: 1 }}>
              {" "}
              {isLoading ? "Generating..." : "Generate & Save Minutes"}{" "}
            </Box>{" "}
          </Button>{" "}
        </motion.div>{" "}
      </CardContent>{" "}
    </Card>
  );
};
// -----------------------------------------------------------

// Main NewMeeting Component
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
    previewStream,
  } = useMeeting();

  const [recordingTime, setRecordingTime] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [meetingTitle, setMeetingTitle] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const waveFrequencyRef = useRef(1.5);
  const waveAmplitudeRef = useRef(20);
  // Ref to track if the transition to step 1 has already happened for the current recording session
  const hasTransitionedToStep1 = useRef(false);

  // Timer for recording duration
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

  // Handle start/stop recording button click
  const toggleRecording = () => {
    console.log(
      `NewMeeting/toggleRecording: Button clicked. Current status='${mediaRecorderStatus}', isRecording=${isRecording}`
    );
    if (!isRecording && mediaRecorderStatus !== "acquiring_media") {
      setRecordingTime(0);
      hasTransitionedToStep1.current = false; // Reset transition flag when starting new recording
      startMeeting();
    } else if (isRecording) {
      endMeeting();
      console.log(
        "NewMeeting/toggleRecording: Called endMeeting. Waiting for status change effect."
      );
    }
  };

  // --- EFFECT TO HANDLE STATE TRANSITION based on recorder status ---
  useEffect(() => {
    // Log status on every change
    console.log(
      `NewMeeting/Status Effect Check: Status='${mediaRecorderStatus}', Step=${activeStep}, TransitionedFlag=${hasTransitionedToStep1.current}`
    );

    // Condition to change step: Status becomes 'stopped', we are in step 0, AND we haven't already transitioned
    if (
      mediaRecorderStatus === "stopped" &&
      activeStep === 0 &&
      !hasTransitionedToStep1.current
    ) {
      console.log(
        "NewMeeting/Status Effect: Detected 'stopped' status while in Step 0. Setting activeStep = 1"
      );
      setActiveStep(1);
      hasTransitionedToStep1.current = true; // Set flag to prevent re-triggering
    }

    // Reset the transition flag if status goes back to idle (e.g., after error or discard)
    // This might need adjustment based on exact desired flow after errors.
    if (mediaRecorderStatus === "idle" && activeStep !== 0) {
      console.log(
        "NewMeeting/Status Effect: Status is idle, resetting activeStep to 0"
      );
      // setActiveStep(0); // Optionally reset step if recorder becomes idle unexpectedly
      // hasTransitionedToStep1.current = false;
    }

    // Rerun ONLY when status changes
    // Reading activeStep inside is safe, but including it could cause loops if not careful
  }, [mediaRecorderStatus]);

  // --- EFFECT TO TRIGGER TRANSCRIPTION automatically ---
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
    // Optional: Log why it didn't trigger if conditions not met
    // else if (activeStep === 1) { console.log("Transcription trigger conditions not fully met."); }
  }, [
    activeStep,
    audioBlob,
    transcription,
    isTranscribing,
    error,
    transcribeMeetingAudio,
  ]);

  // Handler for Step 2: Generate & Save
  const handleGenerateAndSave = async () => {
    console.log("NewMeeting/handleGenerateAndSave: Called.");
    if (!meetingTitle.trim()) {
      console.warn("NewMeeting/handleGenerateAndSave: Meeting title is empty.");
      // TODO: Show user feedback
      return;
    }
    await generateAndSaveMeeting(meetingTitle);
  };

  // Determine loading state for the final button
  const isProcessingMinutes = isGeneratingMinutes || loading;

  // Determine which specific error to show in the ProcessingUI (non-recording/transcription errors)
  const processingError =
    error &&
      !error.startsWith("Transcription failed") &&
      !error.startsWith("Recording Error")
      ? error
      : null;

  // Specific error for the recording step
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
      {/* Background decor */}
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
        {/* Back button */}
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

        {/* Page title */}
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

        {/* Steps indicator */}
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

        {/* Main Content Area */}
        <Box sx={{ display: "flex", justifyContent: "center", minHeight: 400 }}>
          <AnimatePresence mode="wait">
            {/* --- Recording Step UI --- */}
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
                    {/* Display Recording Error */}
                    {recordingError && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {recordingError}
                      </Alert>
                    )}
                  </Box>
                </Card>
              </motion.div>
            )}

            {/* --- Processing Step UI --- */}
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
                  {/* --- Transcription Section --- */}
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

                      {/* Show specific transcription error */}
                      {error &&
                        !isTranscribing &&
                        error.startsWith("Transcription failed") && (
                          <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                          </Alert>
                        )}

                      {/* Display Transcription Text */}
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

                      {/* Placeholders */}
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

                  {/* --- Minutes Generation Section --- */}
                  {transcription &&
                    !isTranscribing &&
                    !error?.startsWith("Transcription failed") && (
                      <ProcessingUI
                        meetingTitle={meetingTitle}
                        setMeetingTitle={setMeetingTitle}
                        onProcess={handleGenerateAndSave}
                        isLoading={isProcessingMinutes}
                        currentError={processingError} // Show relevant errors here
                      />
                    )}

                  {/* Button to record again */}
                  <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Button
                      onClick={() => {
                        console.log("NewMeeting: Clicked 'Record Again'");
                        setActiveStep(0);
                        setRecordingTime(0);
                        // Reset context state if needed, but startMeeting does this
                        // Maybe call a specific reset function in context?
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
