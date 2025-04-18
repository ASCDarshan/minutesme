/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Container,
  Badge,
  Tooltip,
  alpha,
  useTheme,
  useScrollTrigger,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  NotificationsOutlined,
  Settings,
  Logout,
  AccountCircle,
  Dashboard,
  MicNone,
  Person,
  ChevronRight,
  HelpOutline,
} from "@mui/icons-material";
import Logo from "../UI/Logo";

const NotificationBadge = () => {
  const theme = useTheme();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const notifications = [
    {
      id: 1,
      message: "Your meeting 'Product Review' has been transcribed",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      message: "You have 15 minutes of recording time left this month",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      message: "Meeting minutes for 'Team Sync' are ready",
      time: "Yesterday",
      read: true,
    },
  ];

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleMarkAllRead = () => {
    setHasNotifications(false);
    setNotificationCount(0);
    handleNotificationClose();
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={handleNotificationClick}
          sx={{
            position: "relative",
            "&::after": hasNotifications
              ? {
                content: '""',
                position: "absolute",
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: theme.palette.error.main,
                top: 10,
                right: 10,
                boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
              }
              : {},
          }}
        >
          <Badge
            color="error"
            badgeContent={notificationCount}
            invisible={!hasNotifications}
          >
            <NotificationsOutlined />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            width: 360,
            maxWidth: "100%",
            maxHeight: "calc(100vh - 100px)",
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            px: 2,
            py: 2,
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>

            <Button size="small" onClick={handleMarkAllRead}>
              Mark all as read
            </Button>
          </Box>
        </Box>

        <List sx={{ p: 0, maxHeight: 320, overflow: "auto" }}>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              sx={{
                px: 2,
                py: 1.5,
                bgcolor: notification.read
                  ? "transparent"
                  : alpha(theme.palette.primary.main, 0.05),
                borderLeft: notification.read
                  ? "none"
                  : `3px solid ${theme.palette.primary.main}`,
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
              button={true}
            >
              <ListItemText
                primary={notification.message}
                secondary={notification.time}
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: notification.read ? 400 : 600,
                  color: notification.read ? "text.secondary" : "text.primary",
                }}
                secondaryTypographyProps={{
                  variant: "caption",
                }}
              />
              <ChevronRight fontSize="small" color="action" />
            </ListItem>
          ))}

          {notifications.length === 0 && (
            <ListItem sx={{ py: 6 }}>
              <ListItemText
                primary="No notifications"
                secondary="You're all caught up!"
                sx={{ textAlign: "center" }}
              />
            </ListItem>
          )}
        </List>

        <Box
          sx={{
            p: 1.5,
            borderTop: "1px solid",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Button
            size="small"
            fullWidth
            onClick={handleNotificationClose}
            sx={{ borderRadius: 2 }}
          >
            View all notifications
          </Button>
        </Box>
      </Menu>
    </>
  );
};

const ElevatedAppBar = ({ children }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    sx: {
      ...children.props.sx,
      backdropFilter: trigger ? "blur(10px)" : "none",
      backgroundColor: trigger
        ? (theme) => alpha(theme.palette.background.paper, 0.9)
        : (theme) => theme.palette.background.paper,
      borderBottom: (theme) =>
        trigger ? "none" : `1px solid ${theme.palette.divider}`,
      transition: (theme) =>
        theme.transitions.create(
          ["background-color", "box-shadow", "border-bottom"],
          {
            duration: theme.transitions.duration.short,
          }
        ),
    },
  });
};

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    await logout();
    navigate("/login");
  };

  const mobileDrawerContent = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Logo size="medium" />
      </Box>

      {currentUser ? (
        <>
          <Box
            sx={{ p: 2.5, borderBottom: "1px solid", borderColor: "divider" }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={currentUser.photoURL}
                alt={currentUser.displayName || "User"}
                sx={{ width: 40, height: 40 }}
              >
                {currentUser.displayName ? (
                  currentUser.displayName[0].toUpperCase()
                ) : (
                  <Person />
                )}
              </Avatar>

              <Box sx={{ ml: 1.5, overflow: "hidden" }}>
                <Typography variant="subtitle2" noWrap fontWeight={600}>
                  {currentUser.displayName || "User"}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {currentUser.email}
                </Typography>
              </Box>
            </Box>
          </Box>

          <List component="nav" sx={{ flexGrow: 1, p: 2 }}>
            <ListItem
              button
              component={RouterLink}
              to="/"
              selected={isActive("/")}
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 1,
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  },
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                  },
                },
              }}
            >
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem
              button
              component={RouterLink}
              to="/new-meeting"
              selected={isActive("/new-meeting")}
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 1,
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  },
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                  },
                },
              }}
            >
              <ListItemIcon>
                <MicNone />
              </ListItemIcon>
              <ListItemText primary="New Recording" />
            </ListItem>

            <Divider sx={{ my: 2 }} />

            <ListItem
              button
              component={RouterLink}
              to="/profile"
              selected={isActive("/profile")}
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 1,
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  },
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                  },
                },
              }}
            >
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItem>

            <ListItem button onClick={handleLogout} sx={{ borderRadius: 2 }}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItem>
          </List>


        </>
      ) : (
        <Box
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <Button
            variant="contained"
            component={RouterLink}
            to="/login"
            color="primary"
            size="large"
            fullWidth
            onClick={() => setMobileDrawerOpen(false)}
          >
            Sign In
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <ElevatedAppBar>
        <AppBar position="fixed" color="inherit" elevation={0}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexGrow: { xs: 1, md: 0 },
                  mr: { md: 3 },
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <RouterLink
                    to="/"
                    style={{ textDecoration: "none", display: "flex" }}
                  >
                    <Logo size={isMobile ? "small" : "medium"} />
                  </RouterLink>
                </motion.div>
              </Box>

              {!isMobile && currentUser && (
                <Box sx={{ display: "flex", flexGrow: 1 }}>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Button
                      component={RouterLink}
                      to="/"
                      color={isActive("/") ? "primary" : "inherit"}
                      sx={{
                        mx: 1,
                        fontWeight: isActive("/") ? 600 : 500,
                        position: "relative",
                        "&::after": isActive("/")
                          ? {
                            content: '""',
                            position: "absolute",
                            bottom: 6,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 16,
                            height: 3,
                            borderRadius: 4,
                            backgroundColor: theme.palette.primary.main,
                          }
                          : {},
                      }}
                    >
                      Dashboard
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Button
                      component={RouterLink}
                      to="/new-meeting"
                      color={isActive("/new-meeting") ? "primary" : "inherit"}
                      sx={{
                        mx: 1,
                        fontWeight: isActive("/new-meeting") ? 600 : 500,
                        position: "relative",
                        "&::after": isActive("/new-meeting")
                          ? {
                            content: '""',
                            position: "absolute",
                            bottom: 6,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 16,
                            height: 3,
                            borderRadius: 4,
                            backgroundColor: theme.palette.primary.main,
                          }
                          : {},
                      }}
                    >
                      New Recording
                    </Button>
                  </motion.div>
                </Box>
              )}

              <Box sx={{ display: "flex", alignItems: "center" }}>
                {currentUser ? (
                  <>
                    {!isSmall && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="contained"
                          component={RouterLink}
                          to="/new-meeting"
                          startIcon={<MicNone />}
                          sx={{
                            mr: 2,
                            borderRadius: 3,
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          }}
                        >
                          Record
                        </Button>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <NotificationBadge />
                    </motion.div>



                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <Tooltip title="Account">
                        <IconButton
                          onClick={handleUserMenuOpen}
                          size="small"
                          sx={{ ml: 2 }}
                          aria-controls="menu-appbar"
                          aria-haspopup="true"
                        >
                          <Avatar
                            src={currentUser.photoURL}
                            alt={currentUser.displayName}
                            sx={{
                              width: 32,
                              height: 32,
                              border: `2px solid ${theme.palette.primary.main}`,
                            }}
                          >
                            {currentUser.displayName ? (
                              currentUser.displayName[0].toUpperCase()
                            ) : (
                              <AccountCircle />
                            )}
                          </Avatar>
                        </IconButton>
                      </Tooltip>
                    </motion.div>

                    {isMobile && (
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerToggle}
                        sx={{ ml: 1 }}
                      >
                        <MenuIcon />
                      </IconButton>
                    )}

                    <Menu
                      id="menu-appbar"
                      anchorEl={userMenuAnchorEl}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(userMenuAnchorEl)}
                      onClose={handleUserMenuClose}
                      PaperProps={{
                        elevation: 3,
                        sx: {
                          minWidth: 200,
                          borderRadius: 2,
                          mt: 1,
                        },
                      }}
                    >
                      <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {currentUser.displayName || "User"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {currentUser.email}
                        </Typography>
                      </Box>

                      <Divider />

                      <MenuItem
                        component={RouterLink}
                        to="/profile"
                        onClick={handleUserMenuClose}
                        sx={{ py: 1.5 }}
                      >
                        <ListItemIcon>
                          <Person fontSize="small" />
                        </ListItemIcon>
                        My Profile
                      </MenuItem>

                      <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5 }}>
                        <ListItemIcon>
                          <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                      </MenuItem>

                      <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5 }}>
                        <ListItemIcon>
                          <HelpOutline fontSize="small" />
                        </ListItemIcon>
                        Help Center
                      </MenuItem>

                      <Divider />

                      <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Sign Out
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >

                  </motion.div>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </ElevatedAppBar>

      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: 280,
          },
        }}
      >
        {mobileDrawerContent}
      </Drawer>

      <Toolbar />
    </>
  );
};

export default Header;
