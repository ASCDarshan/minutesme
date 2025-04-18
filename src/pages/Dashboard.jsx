/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMeeting } from "../context/MeetingContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  Tooltip,
  Grid,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
  ButtonGroup,
  alpha,
  Skeleton,
  Fab,
  Card,
  CardContent,
  Chip,
  Badge,
  CardHeader,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  WavingHand,
  TaskAlt,
  Mic,
  Share as ShareIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
  AccessTime,
  FilterList,
  CalendarToday,
  NoteAlt,
  EditNote,
} from "@mui/icons-material";
import moment from "moment";

const DashboardGreeting = ({ name }) => {
  const theme = useTheme();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <Box sx={{ mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight={700}
          sx={{ display: "flex", alignItems: "center" }}
        >
          {greeting}, {name || "User"}!
          <motion.div
            animate={{ rotate: [0, 15, -10, 15, 0] }}
            transition={{ duration: 1.5, delay: 0.5 }}
            style={{ display: "inline-flex", marginLeft: "10px" }}
          >
            <WavingHand color="primary" />
          </motion.div>
        </Typography>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mt: 1, fontWeight: 400 }}
        >
          Here's an overview of your recorded meetings.
        </Typography>
      </motion.div>
    </Box>
  );
};

const StatCard = ({ icon, title, value, delay = 0, color }) => {
  const theme = useTheme();
  const ref = useRef(null);

  return (
    <Grid item xs={6} sm={6} md={3}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        style={{ height: "100%" }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            height: "100%",
            borderRadius: 3,
            border: "1px solid",
            borderColor: alpha(color || theme.palette.primary.main, 0.2),
            background: `linear-gradient(145deg, ${alpha(
              color || theme.palette.primary.main,
              0.05
            )}, ${alpha(color || theme.palette.primary.main, 0.1)})`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              right: -10,
              top: -10,
              opacity: 0.1,
              transform: "rotate(10deg)",
              fontSize: "5rem",
            }}
          >
            {icon}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Avatar
              sx={{
                bgcolor: alpha(color || theme.palette.primary.main, 0.15),
                color: color || theme.palette.primary.main,
                mr: 1.5,
              }}
            >
              {icon}
            </Avatar>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontWeight={500}
            >
              {title}
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            {value}
          </Typography>
        </Paper>
      </motion.div>
    </Grid>
  );
};

const MeetingCard = ({ meeting, onDelete, onEdit }) => {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      style={{ height: "100%" }}
    >
      <Card
        component={RouterLink}
        to={`/meeting/${meeting.id}`}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          textDecoration: "none",
          borderRadius: 3,
          overflow: "hidden",
          background: theme.palette.background.paper,
          position: "relative",
          transition: "all 0.3s ease",
          border: "1px solid",
          borderColor: theme.palette.divider,
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
          "&:hover": {
            borderColor: theme.palette.primary.light,
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              {meeting.title?.[0]?.toUpperCase() || "M"}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          }
          title={
            <Tooltip title={meeting.title || "Untitled Meeting"}>
              <Typography
                variant="h6"
                fontWeight={600}
                noWrap
                color="text.primary"
                sx={{ fontSize: "1rem" }}
              >
                {meeting.title || "Untitled Meeting"}
              </Typography>
            </Tooltip>
          }
          subheader={
            <Typography variant="caption" color="text.secondary">
              {formattedDate} • {relativeTime}
            </Typography>
          }
          sx={{ pb: 0 }}
        />

        <CardContent sx={{ pt: 1, flexGrow: 1, pb: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              height: 40,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {meeting?.minutesData?.transcription
              ? "Transcript available..."
              : `Created ${relativeTime}`}
          </Typography>
        </CardContent>

        <Divider />

        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: alpha(theme.palette.secondary.main, 0.2),
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title={`Created by ${meeting.creatorName || "Unknown"}`}>
              <Avatar
                src={meeting.creatorPhotoURL}
                sx={{ width: 28, height: 28, fontSize: "0.8rem" }}
              >
                {meeting.creatorName?.[0] || "?"}
              </Avatar>
            </Tooltip>
            <Typography variant="caption" color="text.black">
              {formattedTime}
            </Typography>
          </Box>
          {getStatusChip()}
        </Box>

        <Menu
          id={`meeting-menu-${meeting.id}`}
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
    </motion.div >
  );
};

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

const EmptyState = ({ onCreateNew }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          textAlign: "center",
          py: { xs: 8, md: 12 },
          px: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          bgcolor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: "blur(10px)",
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Mic sx={{ fontSize: 50, color: theme.palette.primary.main }} />
        </Box>

        <Typography variant="h5" fontWeight={600} gutterBottom>
          Your meeting space is empty
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 400 }}
        >
          Start by recording your first meeting to generate AI minutes.
        </Typography>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            onClick={onCreateNew}
            size="large"
            startIcon={<AddIcon />}
            sx={{ borderRadius: "50px", px: 4, py: 1.5 }}
          >
            Record First Meeting
          </Button>
        </motion.div>
      </Paper>
    </motion.div>
  );
};


const Dashboard = () => {
  const { currentUser } = useAuth();
  const { meetings, loadUserMeetings, loading, error, removeMeeting } =
    useMeeting();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("lastModified");
  const [sortDirection, setSortDirection] = useState("desc");
  const [anchorElSort, setAnchorElSort] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const stableLoadUserMeetings = useCallback(loadUserMeetings, [
    loadUserMeetings,
  ]);
  const stableRemoveMeeting = useCallback(
    (id) => {
      removeMeeting(id);
      setNotification({
        open: true,
        message: "Meeting deleted successfully",
        type: "success",
      });
    },
    [removeMeeting]
  );

  useEffect(() => {
    if (currentUser) {
      stableLoadUserMeetings();
    }
  }, [currentUser]);

  const processedMeetings = useMemo(() => {
    if (!meetings) return [];

    let results = [...meetings];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      results = results.filter((meeting) =>
        meeting?.title?.toLowerCase().includes(search)
      );
    }

    results.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "title":
          valueA = (a.title || "").toLowerCase();
          valueB = (b.title || "").toLowerCase();
          return sortDirection === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        case "createdAt":
          valueA = a.createdAt?.toDate?.() || 0;
          valueB = b.createdAt?.toDate?.() || 0;
          break;
        default:
          valueA = a.lastModified?.toDate?.() || a.createdAt?.toDate?.() || 0;
          valueB = b.lastModified?.toDate?.() || b.createdAt?.toDate?.() || 0;
      }

      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    });

    return results;
  }, [meetings, searchTerm, sortBy, sortDirection]);

  const totalMeetings = meetings?.length || 0;
  const completedMeetings =
    meetings?.filter((m) => m.status === "completed")?.length || 0;
  const now = new Date();
  const todayMeetings =
    meetings?.filter((m) => {
      const date = m.createdAt?.toDate?.();
      return date && moment(date).isSame(now, "day");
    })?.length || 0;

  const handleSortMenuOpen = (event) => setAnchorElSort(event.currentTarget);
  const handleSortMenuClose = () => setAnchorElSort(null);
  const handleSort = (field) => {
    setSortBy((prev) => {
      if (prev === field) {
        setSortDirection((dir) => (dir === "asc" ? "desc" : "asc"));
      } else {
        setSortDirection("desc");
      }
      return field;
    });
    handleSortMenuClose();
  };

  const handleCreateNew = () => navigate("/new-meeting");

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") return;
    setNotification({ ...notification, open: false });
  };

  const renderSkeletons = (count) => {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
          <Skeleton
            variant="rounded"
            height={viewMode === "grid" ? 220 : 90}
            sx={{
              borderRadius: 3,
              opacity: 1 - index * 0.1,
            }}
          />
        </Grid>
      ));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: alpha(theme.palette.background.default, 0.97),
        backgroundImage: `radial-gradient(${alpha(
          theme.palette.primary.main,
          0.05
        )} 1px, transparent 0)`,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 }, flexGrow: 1 }}>
        <DashboardGreeting name={currentUser?.displayName?.split(" ")[0]} />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <StatCard
            icon={<Mic />}
            title="Total Meetings"
            value={totalMeetings}
            color={theme.palette.primary.main}
            delay={0.1}
          />
          <StatCard
            icon={<TaskAlt />}
            title="Processed"
            value={completedMeetings}
            color={theme.palette.success.main}
            delay={0.2}
          />
          <StatCard
            icon={<CalendarToday />}
            title="Today"
            value={todayMeetings}
            color={theme.palette.info.main}
            delay={0.3}
          />
          <StatCard
            icon={<AccessTime />}
            title="Average Duration"
            value="1hr"
            color={theme.palette.secondary.main}
            delay={0.4}
          />
        </Grid>

        {/* Toolbar Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            mb: 3,
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(10px)",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mr: 1,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Your Meetings
              </Typography>
              {!loading && (
                <Chip
                  label={processedMeetings.length}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 2 },
                flexWrap: "wrap",
                width: { xs: "100%", md: "auto" },
                order: { xs: 3, md: 0 },
              }}
            >
              <TextField
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                fullWidth={isMobile}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear search"
                        onClick={() => setSearchTerm("")}
                        edge="end"
                        size="small"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                  sx: {
                    borderRadius: "50px",
                    bgcolor: theme.palette.background.paper,
                    pr: searchTerm ? 0.5 : 2,
                  },
                }}
                sx={{
                  flexGrow: 1,
                  minWidth: { sm: 200, md: 250 },
                  maxWidth: { sm: 250, md: 300 },
                }}
              />

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<SortIcon />}
                  variant="outlined"
                  onClick={handleSortMenuOpen}
                  sx={{
                    borderRadius: "50px",
                    textTransform: "none",
                    color: "text.secondary",
                    borderColor: "divider",
                  }}
                >
                  Sort
                </Button>

                <ButtonGroup
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: "50px",
                    overflow: "hidden",
                    ".MuiButtonGroup-grouped": {
                      border: `1px solid ${theme.palette.divider}`,
                    },
                  }}
                >
                  <Tooltip title="Grid View">
                    <Button
                      onClick={() => setViewMode("list")}
                      sx={{
                        bgcolor:
                          viewMode === "list"
                            ? alpha(theme.palette.primary.main, 0.1)
                            : "inherit",
                        color:
                          viewMode === "list"
                            ? theme.palette.primary.main
                            : "text.secondary",
                      }}
                    >
                      <ListViewIcon fontSize="small" />
                    </Button>
                  </Tooltip>
                  <Tooltip title="List View">

                    <Button
                      onClick={() => setViewMode("grid")}
                      sx={{
                        bgcolor:
                          viewMode === "grid"
                            ? alpha(theme.palette.primary.main, 0.1)
                            : "inherit",
                        color:
                          viewMode === "grid"
                            ? theme.palette.primary.main
                            : "text.secondary",
                      }}
                    >
                      <GridViewIcon fontSize="small" />
                    </Button>
                  </Tooltip>
                </ButtonGroup>


              </Box>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ display: "flex" }}
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateNew}
                  size="small"
                  sx={{
                    borderRadius: "50px",
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: `0 4px 12px ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                    px: 2,
                    py: 1,
                  }}
                >
                  Record New
                </Button>
              </motion.div>
            </Box>
          </Box>
        </Paper>

        <Menu
          id="sort-menu"
          anchorEl={anchorElSort}
          open={Boolean(anchorElSort)}
          onClose={handleSortMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2,
              minWidth: 180,
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <MenuItem
            onClick={() => handleSort("lastModified")}
            sx={{
              fontWeight: sortBy === "lastModified" ? 600 : 400,
              bgcolor:
                sortBy === "lastModified"
                  ? alpha(theme.palette.primary.main, 0.08)
                  : "inherit",
            }}
          >
            <ListItemIcon>
              {sortBy === "lastModified" &&
                (sortDirection === "desc" ? (
                  <KeyboardArrowDownIcon color="primary" fontSize="small" />
                ) : (
                  <KeyboardArrowUpIcon color="primary" fontSize="small" />
                ))}
            </ListItemIcon>
            <ListItemText primary="Last Modified" />
          </MenuItem>
          <MenuItem
            onClick={() => handleSort("createdAt")}
            sx={{
              fontWeight: sortBy === "createdAt" ? 600 : 400,
              bgcolor:
                sortBy === "createdAt"
                  ? alpha(theme.palette.primary.main, 0.08)
                  : "inherit",
            }}
          >
            <ListItemIcon>
              {sortBy === "createdAt" &&
                (sortDirection === "desc" ? (
                  <KeyboardArrowDownIcon color="primary" fontSize="small" />
                ) : (
                  <KeyboardArrowUpIcon color="primary" fontSize="small" />
                ))}
            </ListItemIcon>
            <ListItemText primary="Date Created" />
          </MenuItem>
          <MenuItem
            onClick={() => handleSort("title")}
            sx={{
              fontWeight: sortBy === "title" ? 600 : 400,
              bgcolor:
                sortBy === "title"
                  ? alpha(theme.palette.primary.main, 0.08)
                  : "inherit",
            }}
          >
            <ListItemIcon>
              {sortBy === "title" &&
                (sortDirection === "desc" ? (
                  <KeyboardArrowDownIcon color="primary" fontSize="small" />
                ) : (
                  <KeyboardArrowUpIcon color="primary" fontSize="small" />
                ))}
            </ListItemIcon>
            <ListItemText primary="Title" />
          </MenuItem>
        </Menu>

        <Box sx={{ minHeight: 400 }}>
          {loading ? (
            <Grid container spacing={3}>
              {renderSkeletons(6)}
            </Grid>
          ) : error ? (
            <Alert
              severity="error"
              sx={{
                mt: 2,
                borderRadius: 3,
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
              }}
            >
              Error loading meetings: {error}
            </Alert>
          ) : processedMeetings.length === 0 ? (
            searchTerm ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    textAlign: "center",
                    py: 8,
                    px: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 300,
                    borderRadius: 4,
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                    bgcolor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <SearchIcon
                      sx={{
                        fontSize: 50,
                        color: alpha(theme.palette.text.secondary, 0.5),
                        mb: 2,
                      }}
                    />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      No matching meetings found
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3, maxWidth: 400 }}
                    >
                      Try different search terms or clear your search to see all
                      your meetings.
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CloseIcon />}
                      onClick={() => setSearchTerm("")}
                      sx={{ borderRadius: "50px" }}
                    >
                      Clear Search
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            ) : (
              <EmptyState onCreateNew={handleCreateNew} />
            )
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {viewMode === "grid" ? (
                  <Grid container spacing={3}>
                    {processedMeetings.map((meeting) => (
                      <Grid item xs={12} sm={6} md={4} key={meeting.id}>
                        <MeetingCard
                          meeting={meeting}
                          onDelete={stableRemoveMeeting}
                          onEdit={(id) => navigate(`/meeting/${id}`)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box>
                    {processedMeetings.map((meeting) => (
                      <MeetingListItem
                        key={meeting.id}
                        meeting={meeting}
                        onDelete={stableRemoveMeeting}
                        onEdit={(id) => navigate(`/meeting/${id}`)}
                      />
                    ))}
                  </Box>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </Box>
      </Container>

      <Tooltip title="Record New Meeting">
        <Fab
          color="primary"
          aria-label="record new meeting"
          onClick={handleCreateNew}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        >
          <Mic />
        </Fab>
      </Tooltip>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.type}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 3,
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
