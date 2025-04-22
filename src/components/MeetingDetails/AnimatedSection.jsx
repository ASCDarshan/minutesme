/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Box, Typography, alpha } from "@mui/material";

const AnimatedSection = ({ title, icon, color, children, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px 0px" });
    return (
        <Box ref={ref} sx={{ mb: 5 }}>
            {" "}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: delay * 0.2 }}
            >
                {" "}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    {" "}
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
                        {" "}
                        {icon}{" "}
                    </Box>{" "}
                    <Typography variant="h5" fontWeight={600} color="text.primary">
                        {" "}
                        {title}{" "}
                    </Typography>{" "}
                    <Box
                        sx={{
                            ml: 3,
                            height: 4,
                            borderRadius: 2,
                            bgcolor: alpha(color, 0.15),
                            flexGrow: 1,
                        }}
                    />{" "}
                </Box>{" "}
                <Box sx={{ ml: 2 }}> {children} </Box>{" "}
            </motion.div>{" "}
        </Box>
    );
};

export default AnimatedSection;
