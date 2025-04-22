/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import { WavingHand } from "@mui/icons-material";
const DashboardGreeting = ({ name }) => {
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    return (
        <Box sx={{ mb: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    fontWeight={700}
                    sx={{ display: "flex", alignItems: "center" }}
                >
                    {greeting}, {name || "User"}!
                    <motion.div
                        animate={{ rotate: [0, 15, -10, 15, 0] }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        style={{ display: "inline-flex", marginLeft: "10px" }}
                    >
                        <WavingHand color="primary" />
                    </motion.div>
                </Typography>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mt: 1, fontWeight: 400 }}
                >
                    Here's an overview of your recorded meetings.
                </Typography>
            </motion.div>
        </Box>
    );
};

export default DashboardGreeting;
