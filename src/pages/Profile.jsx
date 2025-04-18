/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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
  ListItemSecondaryAction,
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
  useTheme
} from '@mui/material';
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
  Timer
} from '@mui/icons-material';

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
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid',
            borderColor: theme.palette.divider,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              borderColor: color,
            },
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: alpha(color, 0.1),
                color: color,
                mr: 2
              }}
            >
              {icon}
            </Box>

            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
              {title}
            </Typography>
          </Box>

          <Typography variant="h4" fontWeight={700} color={color} sx={{ mb: 1 }}>
            {value}
          </Typography>
        </Card>
      </motion.div>
    </Box>
  );
};

const SettingItem = ({ icon, primary, secondary, action, divider = true, delay = 0 }) => {
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
            borderBottom: divider ? `1px solid ${theme.palette.divider}` : 'none',
            '&:hover': {
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

          <ListItemSecondaryAction>
            {action}
          </ListItemSecondaryAction>
        </ListItem>
      </motion.div>
    </Box>
  );
};

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
            overflow: 'visible',
            height: '100%',
            border: isActive ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
            position: 'relative',
            boxShadow: isActive
              ? `0 10px 30px ${alpha(theme.palette.primary.main, 0.2)}`
              : '0 4px 20px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
          }}
        >
          {isActive && (
            <Box
              sx={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: theme.palette.primary.main,
                color: 'white',
                py: 0.5,
                px: 2,
                borderRadius: 4,
                fontWeight: 600,
                fontSize: '0.75rem',
                zIndex: 1,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Current Plan
            </Box>
          )}

          <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {title}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h3"
                component="div"
                fontWeight={700}
                sx={{
                  color: isActive ? theme.palette.primary.main : 'text.primary',
                }}
              >
                ${price}
                <Typography component="span" variant="body2" color="text.secondary">
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
                      sx={{ color: isActive ? theme.palette.primary.main : theme.palette.success.main }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color={feature.highlight ? 'primary.main' : 'text.primary'} fontWeight={feature.highlight ? 600 : 400}>
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
              sx={{ mt: 'auto', py: 1, borderRadius: 2 }}
            >
              {isActive ? "Manage Plan" : "Upgrade"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

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
  const [editedName, setEditedName] = useState('');

  const storageUsed = 250;
  const storageLimit = 1000;
  const storagePercentage = (storageUsed / storageLimit) * 100;
  const recordingMinutes = 45;
  const minutesRemaining = 60 - recordingMinutes;
  const totalMeetings = 12;

  const handleLogout = async () => {
    setLogoutDialogOpen(false);
    await logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    setDeleteAccountDialogOpen(false);
    alert('Account deletion will be implemented in a future update');
  };

  const handleEnterEditMode = () => {
    setEditedName(currentUser?.displayName || '');
    setProfileEditMode(true);
  };

  const handleSaveProfile = () => {
    setProfileEditMode(false);
    alert('Profile update will be implemented in a future update');
  };

  const handleCancelEdit = () => {
    setProfileEditMode(false);
  };

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
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

  const freePlanFeatures = [
    { text: "60 minutes of recording per month", highlight: true },
    { text: "AI-powered transcription" },
    { text: "1GB cloud storage" },
    { text: "Basic analytics" },
    { text: "Export to PDF and Text" }
  ];

  const proPlanFeatures = [
    { text: "Unlimited recording time", highlight: true },
    { text: "Advanced AI transcription" },
    { text: "10GB cloud storage" },
    { text: "Priority processing" },
    { text: "Team sharing capabilities" },
    { text: "Export to all formats" }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        background: theme.palette.background.default,
        pb: 8
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '40%',
          background: `radial-gradient(circle at 85% 15%, ${alpha(theme.palette.primary.main, 0.07)} 0%, transparent 70%)`,
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: 3 }}>
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
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              My Profile
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.07)',
                  mb: 4
                }}
              >
                <Box
                  sx={{
                    p: 0,
                    position: 'relative',
                    height: 140,
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
                      damping: 20
                    }}
                    style={{
                      position: 'absolute',
                      bottom: -50,
                      left: '50%',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Tooltip title="Change photo">
                          <IconButton
                            sx={{
                              bgcolor: 'primary.main',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'primary.dark',
                              },
                              width: 32,
                              height: 32,
                              border: '2px solid white'
                            }}
                          >
                            <Camera fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      <Avatar
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || "User"}
                        sx={{
                          width: 100,
                          height: 100,
                          border: '4px solid white',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        }}
                      >
                        {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : <Person />}
                      </Avatar>
                    </Badge>
                  </motion.div>
                </Box>

                <CardContent sx={{ pt: 7, pb: 3, textAlign: 'center' }}>
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

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
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
                            Save
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
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="h5" fontWeight={600} sx={{ mr: 1 }}>
                            {currentUser.displayName || "User"}
                          </Typography>

                          <Tooltip title="Edit profile">
                            <IconButton size="small" onClick={handleEnterEditMode}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {currentUser.email}
                        </Typography>

                        <Chip
                          icon={<VerifiedUser fontSize="small" />}
                          label="Verified Account"
                          color="primary"
                          size="small"
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
              >
                <Timer sx={{ mr: 1, color: theme.palette.primary.main }} />
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
                background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                borderRadius: 3,
                p: 3,
                border: '1px solid',
                borderColor: theme.palette.divider,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Storage Usage
                </Typography>

                <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                  {storageUsed} MB / {storageLimit} MB
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={storagePercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mb: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }
                }}
              />

              <Typography variant="caption" color="text.secondary">
                Your storage includes recordings and transcriptions.
              </Typography>
            </Box>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <List disablePadding>
                    <ListItem
                      button
                      sx={{ py: 2 }}
                      onClick={() => {
                        alert('This feature will be implemented in a future update');
                      }}
                    >
                      <ListItemIcon>
                        <CloudDownload color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Download My Data"
                        secondary="Get a copy of all your data"
                      />
                    </ListItem>

                    <Divider />

                    <ListItem
                      button
                      sx={{ py: 2 }}
                      onClick={() => setLogoutDialogOpen(true)}
                    >
                      <ListItemIcon>
                        <LogoutIcon color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Sign Out"
                        secondary="Log out of your account"
                      />
                    </ListItem>

                    <Divider />

                    <ListItem
                      button
                      sx={{ py: 2 }}
                      onClick={() => setDeleteAccountDialogOpen(true)}
                    >
                      <ListItemIcon>
                        <DeleteForever color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Delete Account"
                        secondary="Permanently remove your account and data"
                        primaryTypographyProps={{ color: 'error' }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  mb: 4,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.07)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
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
                          onChange={() => setNotificationsEnabled(!notificationsEnabled)}
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
                          onChange={() => setAutoTranscribeEnabled(!autoTranscribeEnabled)}
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
                          onChange={() => setHighQualityEnabled(!highQualityEnabled)}
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
                          onChange={() => setVoiceEnhancementEnabled(!voiceEnhancementEnabled)}
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
                variant="h6"
                fontWeight={600}
                sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
              >
                <CreditCard sx={{ mr: 1, color: theme.palette.primary.main }} />
                Subscription Plan
              </Typography>

              <Grid container spacing={3}>
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
                  borderRadius: 4,
                  mb: 4,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.07)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MailIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="h6" fontWeight={600}>
                        Email Notifications
                      </Typography>
                    </Box>

                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                    >
                      Edit
                    </Button>
                  </Box>

                  <List disablePadding>
                    <ListItem sx={{ py: 1.5, px: 0 }}>
                      <ListItemText
                        primary="Meeting Summary"
                        secondary="Get emailed a summary after each meeting"
                      />
                      <Switch defaultChecked edge="end" />
                    </ListItem>

                    <Divider />

                    <ListItem sx={{ py: 1.5, px: 0 }}>
                      <ListItemText
                        primary="Action Items"
                        secondary="Receive reminders about assigned tasks"
                      />
                      <Switch defaultChecked edge="end" />
                    </ListItem>

                    <Divider />

                    <ListItem sx={{ py: 1.5, px: 0 }}>
                      <ListItemText
                        primary="Product Updates"
                        secondary="Learn about new features and improvements"
                      />
                      <Switch edge="end" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                  border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <GroupsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="h6" fontWeight={600}>
                        Team Members
                      </Typography>
                    </Box>

                    <Chip
                      label="Pro Feature"
                      size="small"
                      color="primary"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      }}
                    />
                  </Box>

                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color="text.secondary" paragraph>
                      Invite team members to collaborate on meeting minutes and share recordings.
                    </Typography>

                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<AddIcon />}
                      sx={{ borderRadius: 2 }}
                      onClick={() => alert('This is a Pro feature. Please upgrade your plan.')}
                    >
                      Upgrade to Add Team Members
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
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle>Sign Out</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to sign out of your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary" variant="contained">
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteAccountDialogOpen}
        onClose={() => setDeleteAccountDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccountDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;