/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Box, Typography, Button, Paper, useTheme, alpha } from "@mui/material";
import { Add as AddIcon, Mic } from "@mui/icons-material";

const EmptyState = ({ onCreateNew }) => {
    const theme = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
        >
            <Paper
                elevation={0}
                sx={{
                    textAlign: "center",
                    py: { xs: 8, md: 12 },
                    px: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 400,
                    borderRadius: 4,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    bgcolor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: "blur(10px)",
                }}
            >
                <Box
                    sx={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                    }}
                >
                    <Mic sx={{ fontSize: 50, color: theme.palette.primary.main }} />
                </Box>

                <Typography variant="h5" fontWeight={600} gutterBottom>
                    Your meeting space is empty
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 4, maxWidth: 400 }}
                >
                    Start by recording your first meeting to generate AI minutes.
                </Typography>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        variant="contained"
                        onClick={onCreateNew}
                        size="large"
                        startIcon={<AddIcon />}
                        sx={{ borderRadius: "50px", px: 4, py: 1.5 }}
                    >
                        Record First Meeting
                    </Button>
                </motion.div>
            </Paper>
        </motion.div>
    );
};

export default EmptyState;
