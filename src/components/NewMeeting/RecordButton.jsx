/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { motion } from "framer-motion";
import { Box, IconButton, useTheme, alpha } from "@mui/material";
import { Mic as MicIcon, Stop as StopIcon } from "@mui/icons-material";

const RecordButton = ({ isRecording, onClick, size = 80, ...props }) => {
    const theme = useTheme();

    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ position: 'relative' }}
        >
            <IconButton
                onClick={handleClick}
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
                {...props}
            >
                {isRecording ? (
                    <StopIcon sx={{ fontSize: size / 3 }} />
                ) : (
                    <MicIcon sx={{ fontSize: size / 3 }} />
                )}
            </IconButton>

            {isRecording && (
                <>
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
                                pointerEvents: "none",
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
                    ))}
                </>
            )}
        </motion.div>
    );
};

export default RecordButton;