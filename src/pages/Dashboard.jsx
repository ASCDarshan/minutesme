import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMeeting } from '../context/MeetingContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Button, Container, Typography, Grid, TextField, Avatar, Card,
  CardContent, Chip, IconButton, Menu, MenuItem, ListItemIcon, Divider,
  Tooltip, useTheme, Badge, InputAdornment, CircularProgress,
  SvgIcon // <--- ADD THIS
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  MicNone,
  CalendarToday,
  AccessTime,
  MoreHoriz,
  WavingHand,
  TaskAlt,
  Mic
  
} from '@mui/icons-material';
import moment from 'moment';

// Custom wave icon for recording visualization
const WaveIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M3,12 L5,12 C5.55,12 6,11.55 6,11 L6,3 C6,2.45 5.55,2 5,2 L3,2 C2.45,2 2,2.45 2,3 L2,11 C2,11.55 2.45,12 3,12 Z" />
    <path d="M10,12 L12,12 C12.55,12 13,11.55 13,11 L13,6 C13,5.45 12.55,5 12,5 L10,5 C9.45,5 9,5.45 9,6 L9,11 C9,11.55 9.45,12 10,12 Z" />
    <path d="M17,12 L19,12 C19.55,12 20,11.55 20,11 L20,2 C20,1.45 19.55,1 19,1 L17,1 C16.45,1 16,1.45 16,2 L16,11 C16,11.55 16.45,12 17,12 Z" />
    <path d="M9.12,14.47 L7.72,16.29 C7.26,16.9 7.48,17.7 8.12,18.05 L15.5,22.4 C16.26,22.84 17.21,22.5 17.55,21.71 L23,9.88" />
  </SvgIcon>
);

// Animated greeting text
const AnimatedGreeting = ({ name }) => {
  const theme = useTheme();
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);
  
  return (
    <Box sx={{ mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight={700} 
          sx={{
            display: 'flex',
            alignItems: 'center',
            background: `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${theme.palette.primary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {greeting}, {name}
          <motion.div
            animate={{ 
              rotate: [0, 20, 0],
              y: [0, -5, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: 2,
              repeatDelay: 4
            }}
            style={{ 
              display: 'inline-flex', 
              marginLeft: '8px',
              transformOrigin: 'bottom right'
            }}
          >
            <WavingHand color="primary" />
          </motion.div>
        </Typography>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Ready to capture your next meeting?
        </Typography>
      </motion.div>
    </Box>
  );
};

// Animated statistics cards
const StatCard = ({ icon, value, label, delay = 0, gradient }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card 
        elevation={0}
        sx={{ 
          p: 2, 
          height: '100%',
          borderRadius: 4,
          background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute',
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ mb: 1 }}>
            {icon}
          </Box>
          
          <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
            {value}
          </Typography>
          
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {label}
          </Typography>
        </Box>
      </Card>
    </motion.div>
  );
};

// Animated meeting card
const MeetingCard = ({ meeting, onDelete }) => {
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
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      onDelete(meeting.id);
    }
    setAnchorEl(null);
  };
  
  // Format date
  const formattedDate = meeting.createdAt 
    ? moment(meeting.createdAt.toDate()).format('MMM D, YYYY')
    : 'Date unavailable';
    
  // Format time
  const formattedTime = meeting.createdAt 
    ? moment(meeting.createdAt.toDate()).format('h:mm A')
    : '';
    
  // Estimate meeting duration in minutes (using size as a proxy)
  const durationMinutes = Math.max(1, Math.floor(meeting.duration / 100000));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        y: -5, 
        transition: { duration: 0.2 } 
      }}
      style={{ height: '100%' }}
    >
      <Card
        component={RouterLink}
        to={`/meeting/${meeting.id}`}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none',
          borderRadius: 4,
          overflow: 'visible',
          background: theme.palette.background.paper,
          position: 'relative',
          transition: 'all 0.3s ease',
          border: '1px solid',
          borderColor: theme.palette.divider,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }
        }}
      >
        <CardContent sx={{ p: 3, flexGrow: 1, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6" component="h2" fontWeight={600} gutterBottom color="text.primary">
                {meeting.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip 
                  icon={<CalendarToday fontSize="small" />}
                  label={formattedDate}
                  size="small"
                  sx={{ bgcolor: 'background.default' }}
                />
                
                <Chip 
                  icon={<AccessTime fontSize="small" />}
                  label={`${durationMinutes} min`}
                  size="small"
                  sx={{ bgcolor: 'background.default' }}
                />
              </Box>
            </Box>
            
            <Box>
              <IconButton
                size="small"
                aria-label="more options"
                aria-controls={`meeting-menu-${meeting.id}`}
                aria-haspopup="true"
                onClick={handleMenuClick}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              
              <Menu
                id={`meeting-menu-${meeting.id}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                elevation={3}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                  }
                }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <ShareIcon fontSize="small" />
                  </ListItemIcon>
                  Share
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <DownloadIcon fontSize="small" />
                  </ListItemIcon>
                  Download
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleDelete} sx={{ color: theme.palette.error.main }}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          
          {/* Decorative wavey line */}
          <Box sx={{ 
            display: 'flex', 
            mb: 2, 
            height: 16, 
            overflow: 'hidden',
            opacity: 0.5
          }}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [
                    `${4 + Math.random() * 8}px`,
                    `${8 + Math.random() * 12}px`,
                    `${4 + Math.random() * 8}px`
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                  delay: i * 0.1
                }}
                style={{
                  width: '5px',
                  backgroundColor: theme.palette.primary.main,
                  margin: '0 2px',
                  borderRadius: '2px',
                }}
              />
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
            <Avatar 
              src={meeting.creatorPhotoURL}
              alt={meeting.creatorName || "User"}
              sx={{ width: 24, height: 24, mr: 1 }}
            >
              {meeting.creatorName ? meeting.creatorName[0] : "U"}
            </Avatar>
            
            <Typography variant="body2" color="text.secondary" noWrap>
              {meeting.creatorName || "User"}
            </Typography>
            
            <Box sx={{ ml: 'auto' }}>
              <Chip
                size="small"
                label={meeting.status === 'completed' ? 'Completed' : 'Draft'}
                color={meeting.status === 'completed' ? 'success' : 'default'}
                sx={{ 
                  fontWeight: 500,
                  height: 24
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Empty state component
const EmptyState = ({ searchTerm }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 4,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          borderRadius: 4,
          border: '2px dashed',
          borderColor: theme.palette.divider,
          maxWidth: 600,
          mx: 'auto'
        }}
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'loop'
          }}
        >
          <Mic 
            sx={{ 
              fontSize: 70, 
              color: theme.palette.primary.main,
              mb: 2,
              opacity: 0.8
            }} 
          />
        </motion.div>
        
        <Typography variant="h5" fontWeight={600} gutterBottom>
          {searchTerm 
            ? `No meetings match "${searchTerm}"`
            : "No meetings recorded yet"}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 450, mx: 'auto' }}>
          {searchTerm 
            ? "Try adjusting your search term or clear the search to see all meetings."
            : "Record your first meeting to create AI-powered minutes that capture every important detail."}
        </Typography>
        
        {!searchTerm && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/new-meeting"
              startIcon={<MicNone />}
              size="large"
              sx={{ px: 4, py: 1.5, borderRadius: 3 }}
            >
              Record Your First Meeting
            </Button>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { currentUser } = useAuth();
  const { meetings, loadUserMeetings, loading, removeMeeting } = useMeeting();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const theme = useTheme();
  
  // Stats
  const totalMeetings = meetings.length;
  const totalMinutes = Math.floor(meetings.reduce((acc, meeting) => acc + (meeting.duration || 0), 0) / 100000);
  const completedMeetings = meetings.filter(m => m.status === 'completed').length;

  // Load user meetings on component mount
  useEffect(() => {
    loadUserMeetings();
  }, [currentUser]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle meeting deletion
  const handleDeleteMeeting = async (id) => {
    await removeMeeting(id);
  };

  // Filter meetings based on search term
  const filteredMeetings = meetings.filter(meeting => 
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        position: 'relative',
        pb: 8
      }}
    >
      {/* Background decoration */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: { xs: '100%', md: '50%' },
          height: '50%',
          background: `radial-gradient(circle at top right, ${theme.palette.primary.main}08 0%, transparent 70%)`,
          opacity: 0.8,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, pt: 3 }}>
        <Grid container spacing={4}>
          {/* Left column - Main content */}
          <Grid item xs={12} md={8}>
            {/* Welcome message */}
            <AnimatedGreeting name={currentUser?.displayName?.split(' ')[0] || 'User'} />
            
            {/* Quick stats */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <StatCard 
                  icon={<Mic sx={{ color: 'white', fontSize: 28 }} />}
                  value={totalMeetings}
                  label="Total Meetings"
                  delay={0.1}
                  gradient={['#4158D0', '#C850C0']}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <StatCard 
                  icon={<AccessTime sx={{ color: 'white', fontSize: 28 }} />}
                  value={`${totalMinutes}`}
                  label="Minutes Recorded"
                  delay={0.2}
                  gradient={['#0061ff', '#60efff']}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <StatCard 
                  icon={<TaskAlt sx={{ color: 'white', fontSize: 28 }} />}
                  value={completedMeetings}
                  label="Completed Minutes"
                  delay={0.3}
                  gradient={['#43a047', '#81c784']}
                />
              </Grid>
            </Grid>
            
            {/* Search and Actions */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 4,
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                gap: 2
              }}
            >
              <motion.div
                animate={{ 
                  scale: isSearchFocused ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
                style={{ flexGrow: 1 }}
              >
                <TextField
                  fullWidth
                  placeholder="Search meetings..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 3,
                      bgcolor: 'background.paper',
                      transition: 'all 0.3s ease',
                      boxShadow: isSearchFocused ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isSearchFocused ? theme.palette.primary.main : theme.palette.divider,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      }
                    }
                  }}
                />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/new-meeting"
                  startIcon={<AddIcon />}
                  sx={{ 
                    px: { xs: 2, sm: 3 },
                    py: 1.5,
                    borderRadius: 3,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    minWidth: { xs: '100%', sm: 'auto' }
                  }}
                >
                  New Meeting
                </Button>
              </motion.div>
            </Box>
            
            {/* Meetings list */}
            <Box sx={{ position: 'relative', minHeight: 200 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <CircularProgress size={60} />
                  </motion.div>
                </Box>
              ) : filteredMeetings.length > 0 ? (
                <Grid container spacing={3}>
                  {filteredMeetings.map((meeting, index) => (
                    <Grid item xs={12} sm={6} key={meeting.id}>
                      <MeetingCard 
                        meeting={meeting} 
                        onDelete={handleDeleteMeeting} 
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState searchTerm={searchTerm} />
              )}
            </Box>
          </Grid>
          
          {/* Right column - Activity & Quick actions */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 80 }}>
              {/* New Recording Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    p: 3,
                    mb: 4,
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    color: 'white',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* Decorative circles */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -30,
                      right: -30,
                      width: 150,
                      height: 150,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -40,
                      left: -40,
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.07)',
                    }}
                  />
                  
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      Start Recording
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                      One click to capture your meeting and generate AI minutes.
                    </Typography>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="contained"
                        component={RouterLink}
                        to="/new-meeting"
                        fullWidth
                        size="large"
                        sx={{
                          py: 1.5,
                          bgcolor: 'white',
                          color: theme.palette.primary.dark,
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                          }
                        }}
                        startIcon={
                          <Mic />
                        }
                      >
                        Record Now
                      </Button>
                    </motion.div>
                  </Box>
                </Card>
              </motion.div>
              
              {/* Recent activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Card sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: theme.palette.divider }}>
                  <Box sx={{ p: 3, pb: 2 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Recent Activity
                    </Typography>
                  </Box>
                  
                  <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {meetings.length > 0 ? (
                      meetings.slice(0, 5).map((meeting, index) => (
                        <Box
                          key={meeting.id}
                          sx={{
                            p: 2,
                            borderTop: '1px solid',
                            borderColor: theme.palette.divider,
                            '&:hover': {
                              bgcolor: 'background.default'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box 
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2,
                                background: `rgba(${theme.palette.primary.main}, 0.1)`,
                                color: theme.palette.primary.main
                              }}
                            >
                              <WaveIcon />
                            </Box>
                            
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" fontWeight={500} noWrap>
                                {meeting.title}
                              </Typography>
                              
                              <Typography variant="caption" color="text.secondary">
                                {meeting.createdAt 
                                  ? moment(meeting.createdAt.toDate()).fromNow() 
                                  : 'Recently'}
                              </Typography>
                            </Box>
                            
                            <Tooltip title="View details">
                              <IconButton 
                                component={RouterLink}
                                to={`/meeting/${meeting.id}`}
                                size="small"
                              >
                                <MoreHoriz fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                          No recent activity
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  {meetings.length > 5 && (
                    <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid', borderColor: theme.palette.divider }}>
                      <Button 
                        variant="text" 
                        color="primary"
                        endIcon={<MoreHoriz />}
                        sx={{ fontWeight: 500 }}
                      >
                        View All
                      </Button>
                    </Box>
                  )}
                </Card>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;