/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Box, alpha, useTheme } from "@mui/material";

const AudioProgress = ({ isPlaying, progress = 0, onSeek, duration }) => {
    const theme = useTheme();
    const progressBarRef = useRef(null);
    const handleSeek = (e) => {
        if (!progressBarRef.current || !duration || duration <= 0) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percentage = Math.max(0, Math.min(1, x / width));
        onSeek(percentage * duration);
    };
    return (
        <Box
            sx={{ position: "relative", cursor: "pointer", my: 2 }}
            onClick={handleSeek}
            ref={progressBarRef}
        >
            {" "}
            <Box
                sx={{
                    height: 8,
                    borderRadius: 4,
                    width: "100%",
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                    overflow: "hidden",
                }}
            >
                {" "}
                <Box
                    component={motion.div}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: isPlaying ? 0.1 : 0, ease: "linear" }}
                    sx={{
                        height: "100%",
                        borderRadius: 4,
                        backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }}
                />{" "}
            </Box>{" "}
            <Box
                component={motion.div}
                animate={{
                    left: `${progress * 100}%`,
                    scale: isPlaying ? [1, 1.2, 1] : 1,
                }}
                transition={{
                    left: { duration: isPlaying ? 0.1 : 0, ease: "linear" },
                    scale: {
                        duration: 1.5,
                        repeat: isPlaying ? Infinity : 0,
                        repeatType: "loop",
                    },
                }}
                sx={{
                    position: "absolute",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    bgcolor: theme.palette.primary.main,
                    boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
                    zIndex: 1,
                }}
            />{" "}
        </Box>
    );
};

export default AudioProgress;
