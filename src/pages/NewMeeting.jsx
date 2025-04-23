
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react"; // Added useCallback, useMemo
import { Link as RouterLink } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"; // Import SpeechRecognition
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
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Select, // Added for language selection
  MenuItem, // Added for language selection
  FormControl, // Added for language selection
  InputLabel, // Added for language selection
  Tooltip, // Added for hints
  IconButton, // Added for copy/share
  Snackbar, // Added for copy feedback
} from "@mui/material";
import {
  ArrowBack,
  Mic as MicIcon,
  Info as InfoIcon,
  Notes,
  TipsAndUpdates as TipsIcon,
  LooksOne,
  LooksTwo,
  Looks3,
  Looks4,
  Language as LanguageIcon,
  ContentCopy as CopyIcon,
  Share as ShareIcon,
  MicOff as MicOffIcon,
  HighlightAlt as HighlightIcon,
  PlayArrow as PlayIcon,
} from "@mui/icons-material";
import ProcessingUI from "../components/NewMeeting/ProcessingUI";
import RecordButton from "../components/NewMeeting/RecordButton";
import SoundWave from "../components/NewMeeting/SoundWave";
import Timer from "../components/NewMeeting/Timer";

const HighlightKeywords = React.memo(({ text, keywords, highlightColor }) => {
  if (!keywords?.length || !text) {
    return text;
  }
  const escapedKeywords = keywords.map((kw) =>
    kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const regex = new RegExp(`\\b(${escapedKeywords.join("|")})\\b`, "gi");

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <Box
            component="span"
            key={index}
            sx={{
              backgroundColor: highlightColor,
              borderRadius: "3px",
              p: "0.5px 2px",
            }}
          >
            {part}
          </Box>
        ) : (
          part
        )
      )}
    </>
  );
});

const NewMeeting = () => {
  const {
    isRecording: contextIsRecording,
    mediaRecorderStatus,
    startMeeting,
    endMeeting,
    transcribeMeetingAudio,
    generateAndSaveMeeting,
    transcription: finalTranscription,
    isTranscribing,
    isGeneratingMinutes,
    loading,
    error: contextError,
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
  const liveTranscriptEndRef = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [recordingStopped, setRecordingStopped] = useState(false);

  const [currentLanguage, setCurrentLanguage] = useState("en-US");
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const keywordsToHighlight = useMemo(
    () => [
      "agenda",
      "next steps",
      "action plan",
      "action item",
      "goals",
      "summary",
      "summarize",
      "participants",
      "decision",
      "minutes",
      "deadline",
      "follow up",
      "issue",
      "problem",
      "solution",
      "proposal",
      "vote",
      "assign",
      "task",
      "milestone",
      "blocker",
    ],
    []
  );

  const highlightColor = alpha(theme.palette.secondary.main, 0.3);

  const displayedTranscript =
    finalTranscript + (interimTranscript ? " " + interimTranscript : "");

  useEffect(() => {
    if (contextIsRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [contextIsRecording]);

  useEffect(() => {
    if (contextIsRecording && !listening && browserSupportsSpeechRecognition) {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: currentLanguage,
      });
    } else if (!contextIsRecording && listening) {
      SpeechRecognition.stopListening();
    }
    return () => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };
  }, [
    contextIsRecording,
    listening,
    browserSupportsSpeechRecognition,
    currentLanguage,
    resetTranscript,
  ]);

  // Modified this effect to not auto-transition to step 1
  useEffect(() => {
    if (
      mediaRecorderStatus === "stopped" &&
      activeStep === 0 &&
      !hasTransitionedToStep1.current &&
      audioBlob &&
      false // Disabled auto-transition
    ) {
      setActiveStep(1);
      hasTransitionedToStep1.current = true;
      if (listening) {
        SpeechRecognition.stopListening();
      }
    }
  }, [mediaRecorderStatus, activeStep, audioBlob, listening]);

  useEffect(() => {
    const transcriptionErrorExists =
      contextError && contextError.startsWith("Transcription failed");

    if (
      activeStep === 1 &&
      audioBlob &&
      !finalTranscription &&
      !isTranscribing &&
      !transcriptionErrorExists
    ) {
      transcribeMeetingAudio();
    }
  }, [
    activeStep,
    audioBlob,
    finalTranscription,
    isTranscribing,
    contextError,
    transcribeMeetingAudio,
  ]);

  useEffect(() => {
    if (activeStep === 0 && liveTranscriptEndRef.current) {
      liveTranscriptEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [displayedTranscript, activeStep]);

  const toggleRecording = useCallback(() => {
    if (!contextIsRecording && mediaRecorderStatus !== "acquiring_media") {
      setRecordingTime(0);
      hasTransitionedToStep1.current = false;
      setActiveStep(0);
      setRecordingStopped(false);
      startMeeting();
    } else if (contextIsRecording) {
      endMeeting();
      setRecordingStopped(true);
    }
  }, [contextIsRecording, mediaRecorderStatus, startMeeting, endMeeting]);

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    setCurrentLanguage(newLang);
    if (listening) {
      SpeechRecognition.stopListening().then(() => {
        resetTranscript();
        SpeechRecognition.startListening({
          continuous: true,
          language: newLang,
        });
      });
    }
  };

  const handleCopy = useCallback(async () => {
    if (!transcript) {
      setSnackbarMessage("Nothing to copy!");
      setSnackbarOpen(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(transcript);
      setSnackbarMessage("Transcript copied to clipboard!");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setSnackbarMessage("Failed to copy transcript.");
      setSnackbarOpen(true);
    }
  }, [transcript]);

  const handleShare = useCallback(async () => {
    if (!transcript) {
      setSnackbarMessage("Nothing to share!");
      setSnackbarOpen(true);
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Meeting Transcript",
          text: transcript,
        });
        setSnackbarMessage("Transcript shared successfully!");
        setSnackbarOpen(true);
      } catch (err) {
        console.error("Error sharing:", err);
        if (err.name !== "AbortError") {
          setSnackbarMessage("Failed to share transcript.");
          setSnackbarOpen(true);
        }
      }
    } else {
      console.warn("Web Share API not supported.");
      setSnackbarMessage(
        "Web Share not supported by your browser. Try copying instead."
      );
      setSnackbarOpen(true);
    }
  }, [transcript]);

  const handleGenerateAndSave = async () => {
    if (!meetingTitle.trim()) {
      console.warn("NewMeeting/handleGenerateAndSave: Meeting title is empty.");
      return;
    }
    await generateAndSaveMeeting(meetingTitle);
  };

  const handleProcessRecording = () => {
    if (audioBlob) {
      setActiveStep(1);
      hasTransitionedToStep1.current = true;
      if (listening) {
        SpeechRecognition.stopListening();
      }
    } else {
      setSnackbarMessage("No recording available to process.");
      setSnackbarOpen(true);
    }
  };

  const handleRecordAgain = () => {
    setActiveStep(0);
    setRecordingTime(0);
    resetTranscript();
    setRecordingStopped(false);
    hasTransitionedToStep1.current = false;
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const isProcessingMinutes = isGeneratingMinutes || loading;

  const processingError =
    contextError &&
      !contextError.startsWith("Transcription failed") &&
      !contextError.startsWith("Recording Error")
      ? contextError
      : null;

  const recordingError =
    contextError &&
    (mediaRecorderStatus === "error" ||
      contextError.startsWith("Recording Error"));

  const finalTranscriptionError =
    contextError && contextError.startsWith("Transcription failed");

  const cardElevation = 8;
  const cardBorderRadius = 4;
  const cardBoxShadow = "0 15px 50px rgba(0,0,0,0.08)";

  const speechRecognitionSupported = useMemo(
    () => browserSupportsSpeechRecognition,
    [browserSupportsSpeechRecognition]
  );

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
            <Typography variant="h4" component="h1" fontWeight={700}>
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
                ? "Select language, follow instructions, and start recording"
                : "Review transcription and generate minutes"}
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ maxWidth: 700, mx: "auto" }}
          >
            <Step key="Record">
              <StepLabel
                StepIconComponent={MicIcon}
                StepIconProps={{
                  sx: {
                    fontSize: 28,
                    "&.Mui-active": { color: theme.palette.primary.main },
                    "&.Mui-completed": { color: theme.palette.primary.main },
                  },
                }}
              >
                Record
              </StepLabel>
            </Step>
            <Step key="Process">
              <StepLabel
                StepIconComponent={Notes}
                StepIconProps={{
                  sx: {
                    fontSize: 28,
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
                key="step0-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%" }}
              >
                <Grid
                  container
                  spacing={4}
                  justifyContent="center"
                  alignItems="stretch"
                  display={"flex"}
                >
                  <Box
                    display="flex"
                    gap={2}
                    flexWrap="wrap"
                    justifyContent="center"
                  >
                    <Card
                      elevation={cardElevation}
                      sx={{
                        p: { xs: 1, sm: 1 },
                        borderRadius: cardBorderRadius,
                        boxShadow: cardBoxShadow,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        width: 380,
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <TipsIcon
                            sx={{
                              mr: 1.5,
                              color: theme.palette.info.main,
                              fontSize: 24,
                            }}
                          />
                          <Typography
                            variant="h6"
                            component="h3"
                            fontWeight={600}
                          >
                            {" "}
                            Recording Instructions{" "}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {" "}
                          Follow these steps for better meeting summaries:{" "}
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              {" "}
                              <LooksOne fontSize="small" color="primary" />{" "}
                            </ListItemIcon>
                            <ListItemText primary="Start by stating the names of all participants." />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              {" "}
                              <LooksTwo fontSize="small" color="primary" />{" "}
                            </ListItemIcon>
                            <ListItemText primary='Clearly state the agenda using phrases like "Today\s agenda is..." or "The agenda for the meeting is..."' />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              {" "}
                              <Looks3 fontSize="small" color="primary" />{" "}
                            </ListItemIcon>
                            <ListItemText primary='Mention keywords like "Action Plan", "Goals", or "Next Steps" when discussing actionable items.' />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              {" "}
                              <Looks4 fontSize="small" color="primary" />{" "}
                            </ListItemIcon>
                            <ListItemText primary='Use phrases like "To summarize..." when concluding the meeting.' />
                          </ListItem>
                        </List>
                        <Divider sx={{ my: 2 }} />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            mt: 2,
                          }}
                        >
                          <InfoIcon
                            sx={{
                              mr: 1.5,
                              color: theme.palette.info.main,
                              mt: 0.5,
                              fontSize: 20,
                            }}
                          />
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              gutterBottom
                            >
                              {" "}
                              General Tip{" "}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {" "}
                              Minimize background noise and ensure speakers talk
                              clearly near the microphone.{" "}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                    <Card
                      elevation={cardElevation}
                      sx={{
                        p: { xs: 1, sm: 1 },
                        borderRadius: cardBorderRadius,
                        boxShadow: cardBoxShadow,
                        position: "relative",
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        width: 360,
                      }}
                    >
                      <Box sx={{ position: "absolute", zIndex: 0 }} />
                      <CardContent
                        sx={{
                          position: "relative",
                          zIndex: 1,
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          gutterBottom
                          sx={{ textAlign: "center", mb: 2 }}
                        >
                          Recorder
                        </Typography>
                        <Box
                          sx={{
                            mb: 2,
                            height: 120,
                            bgcolor: alpha(theme.palette.background.paper, 0.5),
                          }}
                        >
                          <SoundWave
                            isRecording={contextIsRecording}
                            frequency={waveFrequencyRef.current}
                            amplitude={waveAmplitudeRef.current}
                          />
                        </Box>
                        <Timer
                          seconds={recordingTime}
                          sx={{ mb: 2, textAlign: "center" }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            mt: "auto",
                            gap: 2,
                          }}
                        >
                          <Box sx={{ textAlign: "center" }}>
                            <Box sx={{ mb: 1 }}>
                              <RecordButton
                                isRecording={contextIsRecording}
                                onClick={toggleRecording}
                                disabled={
                                  mediaRecorderStatus === "acquiring_media" ||
                                  !isMicrophoneAvailable ||
                                  !speechRecognitionSupported
                                }
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 500, minHeight: "1.5em" }}
                            >
                              {mediaRecorderStatus === "acquiring_media"
                                ? "Requesting microphone..."
                                : !speechRecognitionSupported
                                  ? "Speech recognition not supported"
                                  : !isMicrophoneAvailable
                                    ? "Microphone unavailable"
                                    : contextIsRecording
                                      ? "Tap to stop recording"
                                      : "Tap to start recording"}
                            </Typography>
                          </Box>

                          {/* Process Recording Button - Only visible after recording is stopped */}
                          {recordingStopped && audioBlob && !contextIsRecording && (
                            <Button
                              variant="contained"
                              color="secondary"
                              startIcon={<PlayIcon />}
                              onClick={handleProcessRecording}
                              sx={{
                                borderRadius: 28,
                                px: 3,
                                py: 1,
                                fontWeight: 600,
                                boxShadow: `0 4px 14px ${alpha(
                                  theme.palette.secondary.main,
                                  0.4
                                )}`,
                              }}
                            >
                              Process Recording
                            </Button>
                          )}
                        </Box>
                        {recordingError && (
                          <Alert severity="error" sx={{ mt: 2 }}>
                            {typeof recordingError === "string"
                              ? recordingError
                              : "An unknown recording error occurred."}
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                    <Card
                      elevation={cardElevation}
                      sx={{
                        p: { xs: 1, sm: 1 },
                        borderRadius: cardBorderRadius,
                        boxShadow: cardBoxShadow,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        width: 370,
                      }}
                    >
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <HighlightIcon
                              sx={{
                                mr: 1.5,
                                color: "secondary.main",
                                fontSize: 24,
                              }}
                            />
                            <Typography
                              variant="h6"
                              component="h3"
                              fontWeight={600}
                            >
                              {" "}
                              Live Transcript{" "}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <FormControl
                              size="small"
                              sx={{ minWidth: 120 }}
                              disabled={listening}
                            >
                              <InputLabel id="language-select-label">
                                Language
                              </InputLabel>
                              <Select
                                labelId="language-select-label"
                                id="language-select"
                                value={currentLanguage}
                                label="Language"
                                onChange={handleLanguageChange}
                                startAdornment={
                                  <LanguageIcon
                                    sx={{ mr: 0.5, color: "action.active" }}
                                  />
                                }
                                disabled={listening}
                              >
                                <MenuItem value="en-US">English (US)</MenuItem>
                                <MenuItem value="en-GB">English (UK)</MenuItem>
                                <MenuItem value="hi-IN">Hindi (India)</MenuItem>
                                <MenuItem value="gu-IN">
                                  Gujarati (India)
                                </MenuItem>
                              </Select>
                            </FormControl>
                            <Tooltip title="Copy Transcript">
                              <span>
                                <IconButton
                                  onClick={handleCopy}
                                  disabled={!transcript || listening}
                                  size="small"
                                >
                                  <CopyIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Share Transcript">
                              <span>
                                <IconButton
                                  onClick={handleShare}
                                  disabled={
                                    !transcript || listening || !navigator.share
                                  }
                                  size="small"
                                >
                                  <ShareIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            flexGrow: 1,
                            minHeight: 150,
                            maxHeight: 300,
                            overflowY: "auto",
                            p: 2,
                            background: alpha(theme.palette.grey[500], 0.05),
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            fontFamily: "monospace",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            fontSize: "0.875rem",
                          }}
                        >
                          {!speechRecognitionSupported ? (
                            <Alert severity="warning" icon={<MicOffIcon />}>
                              {" "}
                              Speech recognition is not supported by your
                              browser. Try Chrome or Edge.{" "}
                            </Alert>
                          ) : !isMicrophoneAvailable ? (
                            <Alert severity="error" icon={<MicOffIcon />}>
                              {" "}
                              Microphone access denied or microphone not found.
                              Please check browser permissions and hardware.{" "}
                            </Alert>
                          ) : listening ? (
                            <>
                              <HighlightKeywords
                                text={displayedTranscript}
                                keywords={keywordsToHighlight}
                                highlightColor={highlightColor}
                              />
                              <Box
                                component="span"
                                sx={{
                                  animation: "blinker 1s linear infinite",
                                  ml: "2px",
                                  borderLeft: `2px solid ${theme.palette.text.primary}`,
                                }}
                              >
                                {" "}
                              </Box>
                              <style>{` @keyframes blinker { 50% { opacity: 0; } } `}</style>
                            </>
                          ) : transcript ? (
                            <HighlightKeywords
                              text={transcript}
                              keywords={keywordsToHighlight}
                              highlightColor={highlightColor}
                            />
                          ) : contextIsRecording ? (
                            <Typography
                              color="text.secondary"
                              sx={{ fontStyle: "italic" }}
                            >
                              {" "}
                              Listening... Speak clearly.{" "}
                            </Typography>
                          ) : (
                            <Typography
                              color="text.secondary"
                              sx={{ fontStyle: "italic" }}
                            >
                              {" "}
                              Click the record button above to start live
                              transcription.{" "}
                            </Typography>
                          )}
                          <div ref={liveTranscriptEndRef} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div
                key="processor"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%", maxWidth: 700 }}
              >
                <Box>
                  <Card
                    sx={{
                      borderRadius: cardBorderRadius,
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
                          <Notes sx={{ mr: 1, color: "primary.main" }} /> Final
                          Transcription Result
                        </Typography>
                      </Box>
                      {isTranscribing && (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                          <CircularProgress />
                          <Typography sx={{ mt: 1 }} color="text.secondary">
                            {" "}
                            Transcribing audio... Please wait.{" "}
                          </Typography>
                        </Box>
                      )}
                      {finalTranscriptionError && !isTranscribing && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                          {contextError}
                          <Button
                            size="small"
                            onClick={transcribeMeetingAudio}
                            sx={{ ml: 2 }}
                          >
                            {" "}
                            Retry{" "}
                          </Button>
                        </Alert>
                      )}
                      {finalTranscription && !isTranscribing && (
                        <Box
                          sx={{
                            maxHeight: 300,
                            overflowY: "auto",
                            p: 2,
                            background: alpha(theme.palette.grey[500], 0.05),
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: "pre-wrap",
                              fontFamily: "monospace",
                              wordBreak: "break-word",
                            }}
                          >
                            {finalTranscription}
                          </Typography>
                        </Box>
                      )}
                      {!finalTranscription &&
                        !isTranscribing &&
                        audioBlob &&
                        !finalTranscriptionError && (
                          <Typography
                            sx={{ textAlign: "center", py: 4 }}
                            color="text.secondary"
                          >
                            {" "}
                            Processing audio for final transcription...{" "}
                          </Typography>
                        )}
                      {!audioBlob && !isTranscribing && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                          {" "}
                          No audio recording found for final processing. Please
                          record again.{" "}
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  {finalTranscription &&
                    !isTranscribing &&
                    !finalTranscriptionError && (
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
                      variant="outlined"
                      startIcon={<MicIcon />}
                      disabled={isTranscribing || isProcessingMinutes}
                      sx={{ borderRadius: 20 }}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default NewMeeting;
