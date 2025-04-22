/* eslint-disable no-unused-vars */
// profile code 
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    Box,
    Button,
    Container,
    Typography,
    Avatar,
    Card,
    CardContent,
    Grid,
    Divider,
    Switch,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    TextField,
    LinearProgress,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip,
    Badge,
    Chip,
    alpha,
    useTheme,
} from "@mui/material";
import {
    Person,
    ArrowBack,
    Logout as LogoutIcon,
    Storage as StorageIcon,
    CloudDownload,
    DeleteForever,
    NotificationsActive,
    Edit,
    Camera,
    VolumeUp,
    VerifiedUser,
    SettingsVoice,
    Speed,
    CheckCircle,
    Close,
    Add as AddIcon,
    Mail as MailIcon,
    Groups as GroupsIcon,
    CreditCard,
    MusicNote,
    MicNone,
    Timer,
    Settings,
} from "@mui/icons-material";
import StatCard from "../components/Profile/StatCard";
import SettingItem from "../components/Profile/SettingItem";
import PricingCard from "../components/Profile/PricingCard";

const freePlanFeatures = [
    { text: "60 minutes of recording per month", highlight: true },
    { text: "AI-powered transcription" },
    { text: "1GB cloud storage" },
    { text: "Basic analytics" },
    { text: "Export to PDF and Text" },
];

const proPlanFeatures = [
    { text: "Unlimited recording time", highlight: true },
    { text: "Advanced AI transcription" },
    { text: "10GB cloud storage" },
    { text: "Priority processing" },
    { text: "Team sharing capabilities" },
    { text: "Export to all formats" },
];
const Profile = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [autoTranscribeEnabled, setAutoTranscribeEnabled] = useState(true);
    const [highQualityEnabled, setHighQualityEnabled] = useState(false);
    const [voiceEnhancementEnabled, setVoiceEnhancementEnabled] = useState(true);
    const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [profileEditMode, setProfileEditMode] = useState(false);
    const [editedName, setEditedName] = useState("");

    const storageUsed = 250;
    const storageLimit = 1000;
    const storagePercentage = (storageUsed / storageLimit) * 100;
    const recordingMinutes = 45;
    const totalMeetings = 12;

    const handleLogout = async () => {
        setLogoutDialogOpen(false);
        await logout();
        navigate("/login");
    };

    const handleDeleteAccount = async () => {
        setDeleteAccountDialogOpen(false);
        alert("Account deletion will be implemented in a future update");
    };

    const handleEnterEditMode = () => {
        setEditedName(currentUser?.displayName || "");
        setProfileEditMode(true);
    };

    const handleSaveProfile = () => {
        setProfileEditMode(false);
        alert("Profile update will be implemented in a future update");
    };

    const handleCancelEdit = () => {
        setProfileEditMode(false);
    };

    if (!currentUser) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h5" gutterBottom>
                        Please sign in to view your profile
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to="/login"
                        sx={{ mt: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                position: "relative",
                background: theme.palette.background.default,
                pb: 8,
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "40%",
                    background: `radial-gradient(circle at 85% 15%, ${alpha(
                        theme.palette.primary.main,
                        0.07
                    )} 0%, transparent 70%)`,
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, pt: 3 }}>
                <Box sx={{ mb: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Button
                            component={RouterLink}
                            to="/"
                            startIcon={<ArrowBack />}
                            sx={{ mb: 2 }}
                            variant="text"
                            color="inherit"
                        >
                            Back to Dashboard
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Typography
                            variant="h4"
                            component="h1"
                            fontWeight={700}
                            sx={{
                                background: `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${theme.palette.primary.main} 100%)`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                mb: 1,
                            }}
                        >
                            My Profile
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage your account settings and preferences
                        </Typography>
                    </motion.div>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={5} lg={4}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                                    mb: 4,
                                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                    height: "100%",
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 0,
                                        position: "relative",
                                        height: 120,
                                        background: `linear-gradient(120deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.3,
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 20,
                                        }}
                                        style={{
                                            position: "absolute",
                                            bottom: -50,
                                            left: "40%",
                                            transform: "translateX(-50%)",
                                        }}
                                    >
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                        >
                                            <Avatar
                                                src={currentUser.photoURL}
                                                alt={currentUser.displayName || "User"}
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    border: "4px solid white",
                                                    boxShadow: theme.shadows[4],
                                                }}
                                            >
                                                {currentUser.displayName ? (
                                                    currentUser.displayName[0].toUpperCase()
                                                ) : (
                                                    <Person />
                                                )}
                                            </Avatar>
                                        </Badge>
                                    </motion.div>
                                </Box>

                                <CardContent sx={{ pt: 7, pb: 3, textAlign: "center" }}>
                                    <AnimatePresence mode="wait">
                                        {profileEditMode ? (
                                            <motion.div
                                                key="edit-mode"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <TextField
                                                    fullWidth
                                                    label="Display Name"
                                                    value={editedName}
                                                    onChange={(e) => setEditedName(e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ mb: 2 }}
                                                />

                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={handleCancelEdit}
                                                        startIcon={<Close />}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={handleSaveProfile}
                                                        startIcon={<CheckCircle />}
                                                    >
                                                        Save Changes
                                                    </Button>
                                                </Box>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="display-mode"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        fontWeight={600}
                                                        sx={{ mr: 1 }}
                                                    >
                                                        {currentUser.displayName || "User"}
                                                    </Typography>
                                                    <Tooltip title="Edit profile">
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleEnterEditMode}
                                                            sx={{ color: "text.secondary" }}
                                                        >
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    gutterBottom
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {currentUser.email}
                                                </Typography>

                                                <Chip
                                                    icon={<VerifiedUser fontSize="small" />}
                                                    label="Verified Account"
                                                    color="primary"
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ mt: 1, fontSize: "0.75rem" }}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <Box sx={{ mb: 4 }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                sx={{ mb: 2, display: "flex", alignItems: "center" }}
                            >
                                <Timer
                                    sx={{
                                        mr: 1,
                                        color: theme.palette.primary.main,
                                        fontSize: 20,
                                    }}
                                />
                                Usage Statistics
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <StatCard
                                        icon={<MicNone />}
                                        title="Recording Time"
                                        value={`${recordingMinutes}/${60} min`}
                                        color={theme.palette.primary.main}
                                        delay={1}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <StatCard
                                        icon={<MusicNote />}
                                        title="Meetings"
                                        value={totalMeetings}
                                        color={theme.palette.secondary.main}
                                        delay={2}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <StatCard
                                        icon={<StorageIcon />}
                                        title="Storage"
                                        value={`${storageUsed}MB`}
                                        color={theme.palette.info.main}
                                        delay={3}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Box
                            sx={{
                                mb: 4,
                                background: alpha(theme.palette.background.paper, 0.7),
                                borderRadius: 2,
                                p: 2.5,
                                border: "1px solid",
                                borderColor: alpha(theme.palette.divider, 0.2),
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 1,
                                }}
                            >
                                <Typography variant="subtitle2" color="text.secondary">
                                    Storage Usage
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    color="text.primary"
                                    fontWeight={600}
                                >
                                    {storageUsed} MB / {storageLimit} MB
                                </Typography>
                            </Box>

                            <LinearProgress
                                variant="determinate"
                                value={storagePercentage}
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    mb: 1.5,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    "& .MuiLinearProgress-bar": {
                                        borderRadius: 3,
                                        backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    },
                                }}
                            />

                            <Typography variant="caption" color="text.secondary">
                                Your storage includes recordings and transcriptions.{" "}
                                {storagePercentage >= 80 && (
                                    <strong style={{ color: theme.palette.warning.main }}>
                                        Consider upgrading for more space.
                                    </strong>
                                )}
                            </Typography>
                        </Box>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: alpha(theme.palette.divider, 0.2),
                                    boxShadow: "none",
                                }}
                            >
                                <CardContent sx={{ p: 0 }}>
                                    <List disablePadding>
                                        <ListItem
                                            button
                                            sx={{ py: 1.5, px: 2 }}
                                            onClick={() => {
                                                alert(
                                                    "This feature will be implemented in a future update"
                                                );
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <CloudDownload color="primary" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Download My Data"
                                                secondary="Get a copy of all your data"
                                                primaryTypographyProps={{
                                                    variant: "body2",
                                                    fontWeight: 500,
                                                }}
                                                secondaryTypographyProps={{ variant: "caption" }}
                                            />
                                        </ListItem>

                                        <Divider sx={{ my: 0 }} />

                                        <ListItem
                                            button
                                            sx={{ py: 1.5, px: 2 }}
                                            onClick={() => setLogoutDialogOpen(true)}
                                        >
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <LogoutIcon color="info" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Sign Out"
                                                secondary="Log out of your account"
                                                primaryTypographyProps={{
                                                    variant: "body2",
                                                    fontWeight: 500,
                                                }}
                                                secondaryTypographyProps={{ variant: "caption" }}
                                            />
                                        </ListItem>

                                        <Divider sx={{ my: 0 }} />

                                        <ListItem
                                            button
                                            sx={{ py: 1.5, px: 2 }}
                                            onClick={() => setDeleteAccountDialogOpen(true)}
                                        >
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <DeleteForever color="error" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Delete Account"
                                                secondary="Permanently remove your account and data"
                                                primaryTypographyProps={{
                                                    variant: "body2",
                                                    fontWeight: 500,
                                                    color: "error.main",
                                                }}
                                                secondaryTypographyProps={{ variant: "caption" }}
                                            />
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={7} lg={8}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    mb: 4,
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        <Settings
                                            sx={{
                                                mr: 1,
                                                color: theme.palette.primary.main,
                                                verticalAlign: "middle",
                                                fontSize: 20,
                                            }}
                                        />
                                        App Settings
                                    </Typography>

                                    <List disablePadding>
                                        <SettingItem
                                            icon={<NotificationsActive />}
                                            primary="Notifications"
                                            secondary="Get notified when a meeting is processed"
                                            action={
                                                <Switch
                                                    edge="end"
                                                    checked={notificationsEnabled}
                                                    onChange={() =>
                                                        setNotificationsEnabled(!notificationsEnabled)
                                                    }
                                                    size="small"
                                                />
                                            }
                                            delay={1}
                                        />

                                        <SettingItem
                                            icon={<SettingsVoice />}
                                            primary="Auto-transcribe Meetings"
                                            secondary="Automatically start transcription when recording"
                                            action={
                                                <Switch
                                                    edge="end"
                                                    checked={autoTranscribeEnabled}
                                                    onChange={() =>
                                                        setAutoTranscribeEnabled(!autoTranscribeEnabled)
                                                    }
                                                    size="small"
                                                />
                                            }
                                            delay={3}
                                        />

                                        <SettingItem
                                            icon={<Speed />}
                                            primary="High-quality Recording"
                                            secondary="Increase audio quality (uses more storage)"
                                            action={
                                                <Switch
                                                    edge="end"
                                                    checked={highQualityEnabled}
                                                    onChange={() =>
                                                        setHighQualityEnabled(!highQualityEnabled)
                                                    }
                                                    size="small"
                                                />
                                            }
                                            delay={4}
                                        />

                                        <SettingItem
                                            icon={<VolumeUp />}
                                            primary="Voice Enhancement"
                                            secondary="Improve speech clarity in noisy environments"
                                            action={
                                                <Switch
                                                    edge="end"
                                                    checked={voiceEnhancementEnabled}
                                                    onChange={() =>
                                                        setVoiceEnhancementEnabled(!voiceEnhancementEnabled)
                                                    }
                                                    size="small"
                                                />
                                            }
                                            divider={false}
                                            delay={5}
                                        />
                                    </List>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <Box sx={{ mb: 4 }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                sx={{ mb: 2, display: "flex", alignItems: "center" }}
                            >
                                <CreditCard
                                    sx={{
                                        mr: 1,
                                        color: theme.palette.primary.main,
                                        fontSize: 20,
                                    }}
                                />
                                Subscription Plan
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <PricingCard
                                        title="Free Plan"
                                        price="0"
                                        features={freePlanFeatures}
                                        isActive={true}
                                        delay={1}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <PricingCard
                                        title="Pro Plan"
                                        price="9.99"
                                        features={proPlanFeatures}
                                        isActive={false}
                                        delay={2}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    mb: 4,
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            mb: 2,
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <MailIcon
                                                sx={{
                                                    mr: 1,
                                                    color: theme.palette.primary.main,
                                                    fontSize: 20,
                                                }}
                                            />
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Email Notifications
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Edit />}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Edit
                                        </Button>
                                    </Box>

                                    <List disablePadding>
                                        <ListItem sx={{ py: 1, px: 0 }}>
                                            <ListItemText
                                                primary="Meeting Summary"
                                                secondary="Get emailed a summary after each meeting"
                                                primaryTypographyProps={{ variant: "body2" }}
                                                secondaryTypographyProps={{ variant: "caption" }}
                                            />
                                            <Switch defaultChecked edge="end" size="small" />
                                        </ListItem>

                                        <Divider sx={{ my: 0.5 }} />

                                        <ListItem sx={{ py: 1, px: 0 }}>
                                            <ListItemText
                                                primary="Action Items"
                                                secondary="Receive reminders about assigned tasks"
                                                primaryTypographyProps={{ variant: "body2" }}
                                                secondaryTypographyProps={{ variant: "caption" }}
                                            />
                                            <Switch defaultChecked edge="end" size="small" />
                                        </ListItem>

                                        <Divider sx={{ my: 0.5 }} />

                                        <ListItem sx={{ py: 1, px: 0 }}>
                                            <ListItemText
                                                primary="Product Updates"
                                                secondary="Learn about new features and improvements"
                                                primaryTypographyProps={{ variant: "body2" }}
                                                secondaryTypographyProps={{ variant: "caption" }}
                                            />
                                            <Switch edge="end" size="small" />
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>

                            <Card
                                sx={{
                                    borderRadius: 3,
                                    background: alpha(theme.palette.primary.light, 0.03),
                                    border: `1px dashed ${alpha(
                                        theme.palette.primary.main,
                                        0.2
                                    )}`,
                                    boxShadow: "none",
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            mb: 2,
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <GroupsIcon
                                                sx={{
                                                    mr: 1,
                                                    color: theme.palette.primary.main,
                                                    fontSize: 20,
                                                }}
                                            />
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Team Members
                                            </Typography>
                                        </Box>

                                        <Chip
                                            label="Pro Feature"
                                            size="small"
                                            sx={{
                                                background: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main,
                                                fontWeight: 500,
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ textAlign: "center", py: 2 }}>
                                        <Typography color="text.secondary" paragraph sx={{ mb: 2 }}>
                                            Invite team members to collaborate on meeting minutes and
                                            share recordings.
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AddIcon />}
                                            sx={{ borderRadius: 2 }}
                                            onClick={() =>
                                                alert(
                                                    "This is a Pro feature. Please upgrade your plan."
                                                )
                                            }
                                        >
                                            Upgrade to Pro
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            <Dialog
                open={logoutDialogOpen}
                onClose={() => setLogoutDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1,
                        maxWidth: "400px",
                        width: "100%",
                    },
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>Sign Out</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to sign out of your account?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button
                        onClick={() => setLogoutDialogOpen(false)}
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleLogout}
                        color="primary"
                        variant="contained"
                        sx={{ borderRadius: 2 }}
                    >
                        Sign Out
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteAccountDialogOpen}
                onClose={() => setDeleteAccountDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1,
                        maxWidth: "400px",
                        width: "100%",
                    },
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>Delete Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account? This action cannot be
                        undone and all your data will be permanently removed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button
                        onClick={() => setDeleteAccountDialogOpen(false)}
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteAccount}
                        color="error"
                        variant="contained"
                        sx={{ borderRadius: 2 }}
                    >
                        Delete Account
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Profile;
