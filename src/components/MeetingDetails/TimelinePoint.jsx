/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    Box,
    Typography,
    Card,
    Chip,
    IconButton,
    Tooltip,
    alpha,
    useTheme,
} from "@mui/material";
import {
    FormatListBulleted,
    Comment,
    Lightbulb,
    AssignmentTurnedIn,
    Schedule,
    CheckCircle,
    FormatQuote,
    Person,
} from "@mui/icons-material";

const TimelinePoint = ({ time, content, type, delay = 0 }) => {
    const theme = useTheme();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
    const getTypeProps = () => {
        switch (type) {
            case "agenda":
                return {
                    icon: <FormatListBulleted fontSize="small" />,
                    color: theme.palette.primary.main,
                    bgColor: alpha(theme.palette.primary.main, 0.1),
                };
            case "decision":
                return {
                    icon: <Lightbulb fontSize="small" />,
                    color: theme.palette.warning.main,
                    bgColor: alpha(theme.palette.warning.main, 0.1),
                };
            case "action":
                return {
                    icon: <AssignmentTurnedIn fontSize="small" />,
                    color: theme.palette.success.main,
                    bgColor: alpha(theme.palette.success.main, 0.1),
                };
            case "quote":
                return {
                    icon: <FormatQuote fontSize="small" />,
                    color: theme.palette.secondary.main,
                    bgColor: alpha(theme.palette.secondary.main, 0.1),
                };
            default:
                return {
                    icon: <Comment fontSize="small" />,
                    color: theme.palette.info.main,
                    bgColor: alpha(theme.palette.info.main, 0.1),
                };
        }
    };
    const { icon, color, bgColor } = getTypeProps();
    return (
        <Box ref={ref} sx={{ mb: 4, display: "flex" }}>
            {" "}
            <Box
                sx={{
                    position: "relative",
                    mr: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {" "}
                <Box
                    sx={{
                        position: "absolute",
                        top: 12,
                        bottom: -16,
                        width: 2,
                        bgcolor: theme.palette.divider,
                        zIndex: 0,
                    }}
                />{" "}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={
                        isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.3, delay: delay * 0.1 }}
                >
                    {" "}
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            bgcolor: bgColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: color,
                            zIndex: 1,
                            position: "relative",
                        }}
                    >
                        {" "}
                        {icon}{" "}
                    </Box>{" "}
                </motion.div>{" "}
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        mt: 1,
                        fontFamily: "monospace",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                    }}
                >
                    {" "}
                    {time}{" "}
                </Typography>{" "}
            </Box>{" "}
            <Box sx={{ flex: 1 }}>
                {" "}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, delay: delay * 0.1 + 0.2 }}
                >
                    {" "}
                    <Card
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: theme.palette.divider,
                            position: "relative",
                            overflow: "visible",
                            bgcolor: "background.paper",
                            "&:hover": {
                                borderColor: color,
                                boxShadow: `0 4px 20px ${alpha(color, 0.15)}`,
                            },
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                left: -8,
                                top: 12,
                                width: 12,
                                height: 12,
                                bgcolor: "background.paper",
                                transform: "rotate(45deg)",
                                borderBottom: "1px solid",
                                borderLeft: "1px solid",
                                borderColor: theme.palette.divider,
                                zIndex: 0,
                            },
                        }}
                    >
                        {" "}
                        <Typography variant="body1" component="div">
                            {" "}
                            {content}{" "}
                        </Typography>{" "}
                        {type === "action" && (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mt: 1,
                                    pt: 1,
                                    borderTop: "1px dashed",
                                    borderColor: alpha(theme.palette.success.main, 0.3),
                                }}
                            >
                                {" "}
                                <Chip
                                    icon={<Person fontSize="small" />}
                                    label="John"
                                    size="small"
                                    sx={{ mr: 1, bgcolor: alpha(theme.palette.info.main, 0.1) }}
                                />{" "}
                                <Chip
                                    icon={<Schedule fontSize="small" />}
                                    label="Due May 21"
                                    size="small"
                                    sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}
                                />{" "}
                                <Box sx={{ ml: "auto" }}>
                                    {" "}
                                    <Tooltip title="Mark as complete">
                                        {" "}
                                        <IconButton size="small" color="success">
                                            {" "}
                                            <CheckCircle fontSize="small" />{" "}
                                        </IconButton>{" "}
                                    </Tooltip>{" "}
                                </Box>{" "}
                            </Box>
                        )}{" "}
                    </Card>{" "}
                </motion.div>{" "}
            </Box>{" "}
        </Box>
    );
};

export default TimelinePoint;
