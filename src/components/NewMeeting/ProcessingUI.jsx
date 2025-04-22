/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    Card,
    CardContent,
    CircularProgress,
    useTheme,
    Alert,
} from "@mui/material";
import { Settings } from "@mui/icons-material";
import { motion } from "framer-motion";

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

export default ProcessingUI;
