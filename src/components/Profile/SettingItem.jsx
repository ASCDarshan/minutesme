/* eslint-disable no-unused-vars */
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    Box,
    Typography,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    alpha,
    useTheme,
} from "@mui/material";

const SettingItem = ({
    icon,
    primary,
    secondary,
    action,
    divider = true,
    delay = 0,
}) => {
    const theme = useTheme();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <Box ref={ref}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: delay * 0.1 }}
            >
                <ListItem
                    sx={{
                        py: 2,
                        borderBottom: divider
                            ? `1px solid ${theme.palette.divider}`
                            : "none",
                        "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.03),
                        },
                        borderRadius: divider ? 0 : 2,
                    }}
                >
                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                        {icon}
                    </ListItemIcon>

                    <ListItemText
                        primary={
                            <Typography variant="body1" fontWeight={500}>
                                {primary}
                            </Typography>
                        }
                        secondary={secondary}
                    />

                    <ListItemSecondaryAction>{action}</ListItemSecondaryAction>
                </ListItem>
            </motion.div>
        </Box>
    );
};

export default SettingItem;
