/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  Container,
  Typography,
  Alert,
  useTheme,
  IconButton,
  useMediaQuery,
  Stack,
} from "@mui/material";
import {
  Google as GoogleIcon,
  RecordVoiceOver,
  NoteAlt,
  Storage,
  VolumeUp,
  KeyboardArrowRight,
  Mic,
} from "@mui/icons-material";
import Logo from "../components/UI/Logo";

const Dot = ({ delay }) => (
  <motion.div
    style={{
      width: 12,
      height: 12,
      borderRadius: "50%",
      margin: "0 4px",
      display: "inline-block",
      background: "currentColor",
    }}
    initial={{ opacity: 0.3, y: 0 }}
    animate={{
      opacity: [0.3, 1, 0.3],
      y: [0, -10, 0],
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
  />
);

const FeatureCard = ({ icon, title, delay }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        whileHover={{
          rotateY: 15,
          rotateX: -5,
          scale: 1.05,
          transition: { duration: 0.3 },
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            height: { xs: 120, md: 140 },
            width: { xs: 120, md: 140 },
            borderRadius: 4,
            background: theme.palette.background.paper,
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 8px 20px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)`,

            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 4,
              padding: "2px",
              background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.secondary.main})`,
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            },
          }}
        >
          <Box
            sx={{
              color: theme.palette.primary.main,
              fontSize: 40,
              mb: 1,
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "translateZ(20px)",
              },
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="subtitle2"
            align="center"
            color="text.primary"
            fontWeight={600}
            sx={{ transform: "translateZ(5px)" }}
          >
            {title}
          </Typography>
        </Box>
      </motion.div>
    </motion.div>
  );
};

const AudioWave = () => {
  const theme = useTheme();
  const barCount = 20;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 60,
      }}
    >
      {[...Array(barCount)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: [
              `${Math.random() * 30 + 5}px`,
              `${Math.random() * 50 + 10}px`,
              `${Math.random() * 20 + 5}px`,
            ],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.05,
          }}
          style={{
            width: "4px",
            backgroundColor: theme.palette.primary.main,
            margin: "0 2px",
            borderRadius: "2px",
            opacity: 0.6 + (i / barCount) * 0.4,
          }}
        />
      ))}
    </Box>
  );
};

const Login = () => {
  const { login, currentUser, loading, error } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showFeatures, setShowFeatures] = useState(false);

  if (currentUser) {
    return <Navigate to="/" />;
  }

  const handleGoogleLogin = async () => {
    await login();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        position: "relative",
      }}
    >
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0.2 + Math.random() * 0.1,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [
              0.2 + Math.random() * 0.1,
              0.3 + Math.random() * 0.1,
              0.2 + Math.random() * 0.1,
            ],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: 50 + Math.random() * 200,
            height: 50 + Math.random() * 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.palette.primary.light}10 0%, ${theme.palette.primary.main}05 70%)`,
            filter: "blur(40px)",
            zIndex: 0,
          }}
        />
      ))}

      <Container
        maxWidth="lg"
        sx={{ height: "100%", py: 4, zIndex: 1, position: "relative" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: { xs: 3, md: 5 },
            }}
          >
            <Logo size="large" />
          </Box>
        </motion.div>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            py: { xs: 4, md: 8 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Box
              sx={{
                p: { xs: 3, md: 6 },
                maxWidth: 800,
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(20px)",
                borderRadius: 6,
                boxShadow:
                  "0 20px 80px rgba(0, 0, 0, 0.1), 0 10px 30px rgba(0, 0, 0, 0.06)",
                mb: 5,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at top left, ${theme.palette.primary.main}10 0%, transparent 60%)`,
                  zIndex: 0,
                }}
              />

              <Box sx={{ position: "relative", zIndex: 1 }}>
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Alert severity="error" sx={{ mb: 4 }}>
                        {error}
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Box sx={{ textAlign: "center", mb: 5 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <Box component={AudioWave} sx={{ mb: 2 }} />

                    <Typography
                      variant={isMobile ? "h4" : "h3"}
                      component="h1"
                      fontWeight={800}
                      sx={{
                        mb: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%, ${theme.palette.secondary.main} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Transform Your Meetings
                    </Typography>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 400,
                        mb: 4,
                        maxWidth: 600,
                        mx: "auto",
                      }}
                    >
                      AI-powered meeting minutes that capture every detail so
                      you never miss what matters.
                    </Typography>
                  </motion.div>
                </Box>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      startIcon={<GoogleIcon />}
                      sx={{
                        py: 2,
                        px: 6,
                        borderRadius: 3,
                        fontSize: "1.1rem",
                        textTransform: "none",
                        fontWeight: 500,
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                        background: "white",
                        color: "text.primary",
                        border: "2px solid",
                        borderColor: "grey.200",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
                          borderColor: theme.palette.primary.main,
                          background: "white",
                        },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)`,
                          transform: "translateX(-100%)",
                        },
                        "&:hover::after": {
                          transform: "translateX(100%)",
                          transition: "transform 0.6s ease",
                        },
                      }}
                    >
                      {loading ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography sx={{ mr: 1 }}>Signing in</Typography>
                          <Dot delay={0} />
                          <Dot delay={0.1} />
                          <Dot delay={0.2} />
                        </Box>
                      ) : (
                        "Continue with Google"
                      )}
                    </Button>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 2,
                        opacity: 0.7,
                      }}
                    >
                      Free account includes 60 minutes of recording time
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </motion.div>

          <Box sx={{ textAlign: "center", mb: 3 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={() => setShowFeatures(!showFeatures)}
                variant="text"
                color="primary"
                endIcon={
                  <motion.div
                    animate={{
                      rotate: showFeatures ? 90 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <KeyboardArrowRight />
                  </motion.div>
                }
                sx={{ fontWeight: 500, mb: 3 }}
              >
                {showFeatures ? "Hide Features" : "Explore Features"}
              </Button>
            </motion.div>

            <AnimatePresence>
              {showFeatures && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Stack
                    direction="row"
                    spacing={{ xs: 2, md: 4 }}
                    sx={{
                      flexWrap: { xs: "wrap", md: "nowrap" },
                      justifyContent: "center",
                    }}
                  >
                    <FeatureCard
                      icon={<Mic />}
                      title="Voice Recording"
                      delay={0.1}
                    />
                    <FeatureCard
                      icon={<VolumeUp />}
                      title="Audio Transcription"
                      delay={0.2}
                    />
                    <FeatureCard
                      icon={<NoteAlt />}
                      title="AI Minutes"
                      delay={0.3}
                    />
                    <FeatureCard
                      icon={<Storage />}
                      title="Cloud Storage"
                      delay={0.4}
                    />
                  </Stack>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              paddingRight: "3rem",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 120,
                height: 120,
                mt: 4,
                opacity: 0.7,
              }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.7, scale: 1 }}
                  animate={{ opacity: 0, scale: 2 + i * 0.5 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: "easeOut",
                  }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    border: `2px solid ${theme.palette.primary.main}`,
                  }}
                />
              ))}

              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <IconButton
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  <RecordVoiceOver fontSize="large" />
                </IconButton>
              </motion.div>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
