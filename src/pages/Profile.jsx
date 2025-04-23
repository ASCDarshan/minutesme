/* eslint-disable no-unused-vars */
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
  Edit,
  VerifiedUser,
  CheckCircle,
  Close,
  MusicNote,
  MicNone,
  Timer,
} from "@mui/icons-material";
import StatCard from "../components/Profile/StatCard";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
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
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        pb: 6,
      }}
    >
      {/* Background gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '250px',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.7)} 0%, ${alpha(theme.palette.primary.main, 0.5)} 50%, ${alpha(theme.palette.secondary.light, 0.3)} 100%)`,
          zIndex: 0,
          borderRadius: '0 0 30px 30px',
          boxShadow: `0 10px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pt: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBack />}
            sx={{
              mb: 3,
              color: 'white',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: alpha('#fff', 0.1),
              }
            }}
          >
            Back to Dashboard
          </Button>
        </motion.div>

        <Grid container spacing={4}>
          {/* Profile section */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  mb: 3,
                  background: theme.palette.background.paper,
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.07)}`,
                }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    position: 'relative',
                    pt: 4,
                    pb: 3,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: 0.2,
                    }}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        profileEditMode ? null : (
                          <IconButton
                            size="small"
                            onClick={handleEnterEditMode}
                            sx={{
                              bgcolor: theme.palette.primary.main,
                              color: '#fff',
                              width: 32,
                              height: 32,
                              '&:hover': {
                                bgcolor: theme.palette.primary.dark,
                              },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        )
                      }
                    >
                      <Avatar
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'User'}
                        sx={{
                          width: 110,
                          height: 110,
                          border: `4px solid ${theme.palette.background.paper}`,
                          boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}`,
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

                  <Box sx={{ mt: 2 }}>
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
                            sx={{ maxWidth: '80%', mb: 2 }}
                          />

                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              gap: 2,
                            }}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={handleCancelEdit}
                              startIcon={<Close />}
                              sx={{ borderRadius: 2 }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={handleSaveProfile}
                              startIcon={<CheckCircle />}
                              sx={{ borderRadius: 2 }}
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
                          <Typography variant="h5" fontWeight={600}>
                            {currentUser.displayName || 'User'}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {currentUser.email}
                          </Typography>

                          <Chip
                            icon={<VerifiedUser fontSize="small" />}
                            label="Verified Account"
                            color="primary"
                            size="small"
                            sx={{ mt: 2, borderRadius: 1.5 }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                </Box>

                <Divider />

                <CardContent sx={{ px: 2, py: 0 }}>
                  <List disablePadding>
                    <ListItem
                      button
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) },
                      }}
                      onClick={() => {
                        alert('This feature will be implemented in a future update');
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 42 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.main,
                          }}
                        >
                          <CloudDownload fontSize="small" />
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary="Download My Data"
                        secondary="Get a copy of all your data"
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>

                    <ListItem
                      button
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) },
                      }}
                      onClick={() => setLogoutDialogOpen(true)}
                    >
                      <ListItemIcon sx={{ minWidth: 42 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: alpha(theme.palette.info.main, 0.08),
                            color: theme.palette.info.main,
                          }}
                        >
                          <LogoutIcon fontSize="small" />
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary="Sign Out"
                        secondary="Log out of your account"
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>

                    <ListItem
                      button
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.05) },
                      }}
                      onClick={() => setDeleteAccountDialogOpen(true)}
                    >
                      <ListItemIcon sx={{ minWidth: 42 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: alpha(theme.palette.error.main, 0.08),
                            color: theme.palette.error.main,
                          }}
                        >
                          <DeleteForever fontSize="small" />
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary="Delete Account"
                        secondary="Permanently remove your account and data"
                        primaryTypographyProps={{ fontWeight: 500, color: 'error.main' }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Right column with statistics */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  mb: 3,
                  background: theme.palette.background.paper,
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.07)}`,
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                    Account Overview
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <StatCard
                        icon={<MicNone />}
                        title="Recording Time"
                        value={`${recordingMinutes}/60 min`}
                        color={theme.palette.primary.main}
                        delay={1}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <StatCard
                        icon={<MusicNote />}
                        title="Meetings"
                        value={totalMeetings}
                        color={theme.palette.secondary.main}
                        delay={2}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <StatCard
                        icon={<StorageIcon />}
                        title="Storage"
                        value={`${storageUsed}MB`}
                        color={theme.palette.info.main}
                        delay={3}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  mb: 3,
                  background: theme.palette.background.paper,
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.07)}`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Storage Usage
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        py: 0.5,
                        px: 1.5,
                        borderRadius: 5,
                        backgroundColor: storagePercentage >= 80
                          ? alpha(theme.palette.warning.main, 0.1)
                          : alpha(theme.palette.success.main, 0.1),
                        color: storagePercentage >= 80
                          ? theme.palette.warning.main
                          : theme.palette.success.main,
                        fontWeight: 600,
                      }}
                    >
                      {storagePercentage.toFixed(0)}% Used
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {storageUsed} MB Used
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {storageLimit} MB Total
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={storagePercentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: storagePercentage >= 80
                            ? `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`
                            : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        },
                      }}
                    />
                  </Box>

                  {storagePercentage >= 80 ? (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.warning.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        <strong style={{ color: theme.palette.warning.main }}>Running low on storage.</strong>
                        {' '}Consider upgrading your account for more space.
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        color="warning"
                        sx={{ ml: 'auto', borderRadius: 2 }}
                      >
                        Upgrade
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Your storage includes recordings and transcriptions.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  background: theme.palette.background.paper,
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.07)}`,
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Recent Activity
                  </Typography>

                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Recent activity will appear here.
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{ mt: 2, borderRadius: 2 }}
                    >
                      Go to Dashboard
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Dialogs */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            maxWidth: '400px',
            width: '100%',
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
            maxWidth: '400px',
            width: '100%',
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
