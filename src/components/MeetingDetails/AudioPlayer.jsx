/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import {
    Box,
    Card,
    Typography,
    IconButton,
    Chip,
    alpha,
    useTheme,
} from "@mui/material";
import { PlayArrow, Pause, SkipNext, SkipPrevious } from "@mui/icons-material";
import { motion } from "framer-motion";
import AudioWave from "./AudioWave";
import AudioProgress from "./AudioProgress";

const AudioPlayer = ({ audioUrl }) => {
    const theme = useTheme();
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);

    const formatTime = (seconds) => {
        const validSeconds = isNaN(seconds) || !isFinite(seconds) ? 0 : seconds;
        const mins = Math.floor(validSeconds / 60);
        const secs = Math.floor(validSeconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedMetadata = () => {
            const dur = audio.duration;
            if (!isNaN(dur)) setDuration(dur);
        };

        const handleTimeUpdate = () => {
            if (!isNaN(audio.duration)) {
                setCurrentTime(audio.currentTime);
                setProgress(audio.currentTime / audio.duration);
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            if (audio) audio.currentTime = 0;
        };

        const handleError = (e) => {
            console.error("Audio error:", e);
        };

        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("error", handleError);
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
        }
    }, [audioUrl]);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio
                .play()
                .then(() => {
                    if (audio.duration && !isNaN(audio.duration)) {
                        setDuration(audio.duration);
                    }
                })
                .catch((e) => console.error("Audio play error:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (newTime) => {
        if (audioRef.current && isFinite(newTime)) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
            if (duration > 0) setProgress(newTime / duration);
        }
    };

    const skip = (seconds) => {
        if (audioRef.current && duration > 0) {
            const newTime = Math.min(
                duration,
                Math.max(0, audioRef.current.currentTime + seconds)
            );
            handleSeek(newTime);
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            <Card
                sx={{
                    p: 3,
                    borderRadius: 4,
                    position: "relative",
                    overflow: "hidden",
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "50%",
                        height: "100%",
                        opacity: 0.03,
                        background: `linear-gradient(135deg, transparent 0%, ${theme.palette.primary.main} 100%)`,
                        zIndex: 0,
                    }}
                />

                <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            mb: 2,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <AudioWave sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                            <Typography variant="h6" fontWeight={600}>
                                Meeting Audio
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </Typography>
                            <Chip
                                size="small"
                                label={formatTime(duration)}
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    fontWeight: 500,
                                    ml: 1,
                                }}
                            />
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            height: 60,
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                width: "100%",
                            }}
                        >
                            {[...Array(50)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        height: isPlaying
                                            ? [
                                                `${5 + Math.random() * 10}px`,
                                                `${10 + Math.random() * 30}px`,
                                                `${5 + Math.random() * 10}px`,
                                            ]
                                            : "5px",
                                    }}
                                    transition={{
                                        duration: 0.8 + Math.random() * 0.4,
                                        repeat: isPlaying ? Infinity : 0,
                                        repeatType: "reverse",
                                        ease: "easeInOut",
                                        delay: i * 0.02,
                                    }}
                                    style={{
                                        flexGrow: 1,
                                        height: "5px",
                                        borderRadius: "2px",
                                        backgroundColor:
                                            i % 3 === 0
                                                ? alpha(theme.palette.primary.main, 0.8)
                                                : i % 3 === 1
                                                    ? alpha(theme.palette.primary.light, 0.6)
                                                    : alpha(theme.palette.primary.dark, 0.7),
                                        transition: "background-color 0.3s ease",
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    <AudioProgress
                        isPlaying={isPlaying}
                        progress={progress}
                        onSeek={handleSeek}
                        duration={duration}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: { xs: 1, sm: 2 },
                            mt: 2,
                        }}
                    >
                        <IconButton
                            onClick={() => skip(-10)}
                            sx={{
                                color: theme.palette.text.primary,
                                "&:hover": {
                                    color: theme.palette.primary.main,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                },
                            }}
                        >
                            <SkipPrevious />
                        </IconButton>

                        <IconButton
                            onClick={togglePlayPause}
                            sx={{
                                width: 56,
                                height: 56,
                                bgcolor: theme.palette.primary.main,
                                color: "white",
                                "&:hover": { bgcolor: theme.palette.primary.dark },
                            }}
                        >
                            {isPlaying ? <Pause /> : <PlayArrow />}
                        </IconButton>

                        <IconButton
                            onClick={() => skip(10)}
                            sx={{
                                color: theme.palette.text.primary,
                                "&:hover": {
                                    color: theme.palette.primary.main,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                },
                            }}
                        >
                            <SkipNext />
                        </IconButton>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};

export default AudioPlayer;
