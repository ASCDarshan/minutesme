/* eslint-disable no-unused-vars */
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    alpha,
    useTheme,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const PricingCard = ({ title, price, features, isActive, delay = 0 }) => {
    const theme = useTheme();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <Box ref={ref}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: delay * 0.2 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
                <Card
                    sx={{
                        borderRadius: 4,
                        overflow: "visible",
                        height: "100%",
                        border: isActive
                            ? `2px solid ${theme.palette.primary.main}`
                            : `1px solid ${theme.palette.divider}`,
                        position: "relative",
                        boxShadow: isActive
                            ? `0 10px 30px ${alpha(theme.palette.primary.main, 0.2)}`
                            : "0 4px 20px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s ease",
                    }}
                >
                    {isActive && (
                        <Box
                            sx={{
                                position: "absolute",
                                top: -12,
                                left: "50%",
                                transform: "translateX(-50%)",
                                bgcolor: theme.palette.primary.main,
                                color: "white",
                                py: 0.5,
                                px: 2,
                                borderRadius: 4,
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                zIndex: 1,
                                letterSpacing: "0.5px",
                                textTransform: "uppercase",
                            }}
                        >
                            Current Plan
                        </Box>
                    )}

                    <CardContent
                        sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}
                    >
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {title}
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="h3"
                                component="div"
                                fontWeight={700}
                                sx={{
                                    color: isActive ? theme.palette.primary.main : "text.primary",
                                }}
                            >
                                ${price}
                                <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    /month
                                </Typography>
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <List sx={{ mb: 2, flexGrow: 1 }}>
                            {features.map((feature, index) => (
                                <ListItem key={index} dense disableGutters sx={{ py: 1 }}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle
                                            fontSize="small"
                                            sx={{
                                                color: isActive
                                                    ? theme.palette.primary.main
                                                    : theme.palette.success.main,
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="body2"
                                                color={
                                                    feature.highlight ? "primary.main" : "text.primary"
                                                }
                                                fontWeight={feature.highlight ? 600 : 400}
                                            >
                                                {feature.text}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <Button
                            variant={isActive ? "outlined" : "contained"}
                            color={isActive ? "primary" : "primary"}
                            fullWidth
                            sx={{ mt: "auto", py: 1, borderRadius: 2 }}
                        >
                            {isActive ? "Manage Plan" : "Upgrade"}
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </Box>
    );
};

export default PricingCard;
