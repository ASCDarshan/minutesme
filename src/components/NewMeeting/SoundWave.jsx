/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useAnimation } from "framer-motion";
import { Box, useTheme } from "@mui/material";
import { motion } from "framer-motion";

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

export default SoundWave;
