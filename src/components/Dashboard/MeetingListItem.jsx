/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Box,
    Typography,
    IconButton,
    Divider,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    alpha,
    Card,
    Chip,
} from "@mui/material";
import {
    Delete as DeleteIcon,
    TaskAlt,
    Share as ShareIcon,
    Download as DownloadIcon,
    MoreVert as MoreVertIcon,
    EditNote,
} from "@mui/icons-material";
import moment from "moment";

const MeetingListItem = ({ meeting, onDelete }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        setAnchorEl(null);
    };

    const handleDelete = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (window.confirm("Delete this meeting?")) {
            onDelete(meeting.id);
        }
        setAnchorEl(null);
    };

    const formattedDate = meeting.createdAt?.toDate()
        ? moment(meeting.createdAt.toDate()).format("ddd, MMM D")
        : "--";
    const formattedTime = meeting.createdAt?.toDate()
        ? moment(meeting.createdAt.toDate()).format("h:mm A")
        : "--";
    const relativeTime = meeting.createdAt?.toDate()
        ? moment(meeting.createdAt.toDate()).fromNow()
        : "";

    const getStatusChip = () => {
        switch (meeting.status) {
            case "completed":
                return (
                    <Chip
                        label="Processed"
                        size="small"
                        color="success"
                        variant="outlined"
                        icon={<TaskAlt fontSize="small" />}
                    />
                );
            case "completed_partial":
                return (
                    <Chip
                        label="Partial"
                        size="small"
                        color="warning"
                        variant="outlined"
                        icon={<EditNote fontSize="small" />}
                    />
                );
            case "failed":
                return (
                    <Chip label="Failed" size="small" color="error" variant="outlined" />
                );
            default:
                return <Chip label={meeting.status || "Draft"} size="small" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{
                y: -2,
                transition: { duration: 0.2 },
            }}
        >
            <Card
                component={RouterLink}
                to={`/meeting/${meeting.id}`}
                sx={{
                    display: "flex",
                    textDecoration: "none",
                    borderRadius: 3,
                    overflow: "hidden",
                    background: theme.palette.background.paper,
                    transition: "all 0.3s ease",
                    border: "1px solid",
                    borderColor: theme.palette.divider,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    mb: 2,
                    "&:hover": {
                        borderColor: theme.palette.primary.light,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    },
                }}
            >
                <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                    <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
                        <Avatar
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                height: 40,
                                width: 40,
                            }}
                        >
                            {meeting.title?.[0]?.toUpperCase() || "M"}
                        </Avatar>
                    </Box>

                    <Box sx={{ flexGrow: 1, py: 2, pr: 2 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    color="text.primary"
                                >
                                    {meeting.title || "Untitled Meeting"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {formattedDate} • {formattedTime} • {relativeTime}
                                </Typography>
                            </Box>
                            <Box
                                sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}
                            >
                                {getStatusChip()}
                                <IconButton size="small" onClick={handleMenuClick}>
                                    <MoreVertIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Menu
                    id={`meeting-list-menu-${meeting.id}`}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    onClick={(e) => e.stopPropagation()}
                    PaperProps={{
                        elevation: 3,
                        sx: {
                            borderRadius: 2,
                            minWidth: 180,
                            overflow: "hidden",
                            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                        },
                    }}
                >
                    <MenuItem
                        onClick={(e) => {
                            handleMenuClose(e);
                        }}
                    >
                        <ListItemIcon>
                            <ShareIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Share" />
                    </MenuItem>
                    <MenuItem
                        onClick={(e) => {
                            handleMenuClose(e);
                        }}
                    >
                        <ListItemIcon>
                            <DownloadIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Download" />
                    </MenuItem>
                    <Divider />
                    <MenuItem
                        onClick={handleDelete}
                        sx={{ color: theme.palette.error.main }}
                    >
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText primary="Delete" />
                    </MenuItem>
                </Menu>
            </Card>
        </motion.div>
    );
};

export default MeetingListItem;
