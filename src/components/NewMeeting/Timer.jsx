/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";

const Timer = ({ seconds }) => {
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

export default Timer;
