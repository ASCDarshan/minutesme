/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Tooltip,
  Grid,
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
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  TaskAlt,
  Mic,
  CalendarToday,
  AccessTime,
} from "@mui/icons-material";
import moment from "moment";
import DashboardGreeting from "../components/Dashboard/DashboardGreeting";
import StatCard from "../components/Dashboard/StatCard";
import MeetingCard from "../components/Dashboard/MeetingCard";
import MeetingListItem from "../components/Dashboard/MeetingListItem";
import EmptyState from "../components/Dashboard/EmptyState";
import { useNavigate } from "react-router-dom";
import DashboardShimmer from "../components/UI/DashboardShimmer";

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
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

  if (loading) return (
    <>
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
          <Box sx={{ mb: 4 }}>
            <DashboardShimmer type="statcard" count={4} />
          </Box>
          <DashboardShimmer type={viewMode === "grid" ? "card" : "list"} count={6} />
        </Container>
      </Box>
    </>
  )

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
          {error ? (
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
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
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
                      Try different search terms or clear your search to see all your
                      meetings.
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
