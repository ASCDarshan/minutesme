/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import {
    Box,
    Typography,
    Paper,
    Grid,
    Avatar,
    useTheme,
    alpha,
} from "@mui/material";

const StatCard = ({ icon, title, value, delay = 0, color }) => {
    const theme = useTheme();

    return (
        <Grid item xs={6} sm={6} md={3}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: delay }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                style={{ height: "100%" }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        height: "100%",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: alpha(color || theme.palette.primary.main, 0.2),
                        background: `linear-gradient(145deg, ${alpha(
                            color || theme.palette.primary.main,
                            0.05
                        )}, ${alpha(color || theme.palette.primary.main, 0.1)})`,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            right: -10,
                            top: -10,
                            opacity: 0.1,
                            transform: "rotate(10deg)",
                            fontSize: "5rem",
                        }}
                    >
                        {icon}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Avatar
                            sx={{
                                bgcolor: alpha(color || theme.palette.primary.main, 0.15),
                                color: color || theme.palette.primary.main,
                                mr: 1.5,
                            }}
                        >
                            {icon}
                        </Avatar>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            fontWeight={500}
                        >
                            {title}
                        </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight={700} color="text.primary">
                        {value}
                    </Typography>
                </Paper>
            </motion.div>
        </Grid>
    );
};

export default StatCard;
