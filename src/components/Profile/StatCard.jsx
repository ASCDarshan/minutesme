/* eslint-disable no-unused-vars */
import React, { useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Box, Typography, Card, alpha, useTheme } from "@mui/material";

const StatCard = ({ icon, title, value, color, delay = 0 }) => {
    const theme = useTheme();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <Box ref={ref}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: delay * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
                <Card
                    sx={{
                        p: 2,
                        height: "100%",
                        borderRadius: 3,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                        border: "1px solid",
                        borderColor: theme.palette.divider,
                        transition: "all 0.3s ease",
                        "&:hover": {
                            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                            borderColor: color,
                        },
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                bgcolor: alpha(color, 0.1),
                                color: color,
                                mr: 2,
                            }}
                        >
                            {icon}
                        </Box>

                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            color="text.primary"
                        >
                            {title}
                        </Typography>
                    </Box>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                        color={color}
                        sx={{ mb: 1 }}
                    >
                        {value}
                    </Typography>
                </Card>
            </motion.div>
        </Box>
    );
};

export default StatCard;
