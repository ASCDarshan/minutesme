import React, { useEffect, useState, useRef, useCallback } from 'react'; // Added useCallback
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useMeeting } from '../context/MeetingContext';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Box, Button, Container, Typography, Paper, Card, CardContent, Chip, Avatar,
  IconButton, Menu, MenuItem, Grid, Divider, Tooltip, Tab, Tabs, ListItemIcon,
  CircularProgress, Alert, Stack, Badge, alpha, useTheme, useMediaQuery, SvgIcon // Added SvgIcon here
} from '@mui/material';
import {
  ArrowBack, MoreVert, Share as ShareIcon, Download as DownloadIcon, Delete as DeleteIcon,
  Edit as EditIcon, ContentCopy, CalendarToday, AccessTime, People, FormatListBulleted,
  Comment, Lightbulb, AssignmentTurnedIn, Schedule, MicNone, NoteAlt, Bookmark,
  BookmarkBorder, PlayArrow, Pause, SkipNext, SkipPrevious, CheckCircle, FormatQuote,
  MoreHoriz, Public, Email, Person
} from '@mui/icons-material';
import moment from 'moment';

// Custom AudioWave SVG icon (assuming definition is needed here)
const AudioWave = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M12,3L12,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M8,5L8,19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M16,5L16,19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4,9L4,15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M20,9L20,15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </SvgIcon>
);

// Audio player progress animation component
const AudioProgress = ({ isPlaying, progress = 0, onSeek, duration }) => {
  const theme = useTheme();
  const progressBarRef = useRef(null);

  const handleSeek = (e) => {
    if (!progressBarRef.current || !duration || duration <= 0) return; // Added duration check
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width)); // Clamp percentage
    onSeek(percentage * duration);
  };

  return (
    <Box sx={{ position: 'relative', cursor: 'pointer', my: 2 }} onClick={handleSeek} ref={progressBarRef}>
      <Box sx={{ height: 8, borderRadius: 4, width: '100%', bgcolor: alpha(theme.palette.primary.main, 0.15), overflow: 'hidden', }} >
        <Box component={motion.div} animate={{ width: `${progress * 100}%` }} transition={{ duration: isPlaying ? 0.1 : 0, ease: 'linear' }} sx={{ height: '100%', borderRadius: 4, backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, }} />
      </Box>
      <Box component={motion.div} animate={{ left: `${progress * 100}%`, scale: isPlaying ? [1, 1.2, 1] : 1, }} transition={{ left: { duration: isPlaying ? 0.1 : 0, ease: 'linear' }, scale: { duration: 1.5, repeat: isPlaying ? Infinity : 0, repeatType: 'loop' } }} sx={{ position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', width: 16, height: 16, borderRadius: '50%', bgcolor: theme.palette.primary.main, boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`, zIndex: 1, }} />
    </Box>
  );
};

// Audio Player Component
const AudioPlayer = ({ audioUrl }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  const formatTime = (seconds) => {
    const validSeconds = isNaN(seconds) || !isFinite(seconds) ? 0 : seconds; // Handle NaN/Infinity
    const mins = Math.floor(validSeconds / 60);
    const secs = Math.floor(validSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Setup listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleTimeUpdate = () => {
        if (audio.duration) {
            setCurrentTime(audio.currentTime);
            setProgress(audio.currentTime / audio.duration);
        }
    };
    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        if(audio) audio.currentTime = 0; // Reset time
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    // Cleanup
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []); // Run once on mount

  // Control functions
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio play error:", e)); // Added catch
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newTime) => {
    if (audioRef.current && isFinite(newTime)) { // Added check for finite number
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime); // Update currentTime immediately for responsiveness
      if (duration > 0) setProgress(newTime / duration);
    }
  };

  const skip = (seconds) => {
     if (audioRef.current && duration > 0) {
       const newTime = Math.min(duration, Math.max(0, audioRef.current.currentTime + seconds));
       handleSeek(newTime); // Use handleSeek to update state correctly
     }
   };

  return (
    <Box sx={{ width: '100%' }}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <Card sx={{ p: 3, borderRadius: 4, position: 'relative', overflow: 'hidden', bgcolor: alpha(theme.palette.primary.main, 0.05), border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`, }} >
        <Box sx={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', opacity: 0.03, background: `linear-gradient(135deg, transparent 0%, ${theme.palette.primary.main} 100%)`, zIndex: 0, }} />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2 }} >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AudioWave sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight={600}> Meeting Audio </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {formatTime(currentTime)} / {formatTime(duration)}
              </Typography>
              <Chip size="small" label={formatTime(duration)} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, fontWeight: 500, ml: 1 }} />
            </Box>
          </Box>
          {/* Animated audio bars */}
          <Box sx={{ height: 60, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', }} >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%' }}>
              {[...Array(50)].map((_, i) => ( <motion.div key={i} animate={{ height: isPlaying ? [`${5 + Math.random() * 10}px`, `${10 + Math.random() * 30}px`, `${5 + Math.random() * 10}px`] : '5px' }} transition={{ duration: 0.8 + Math.random() * 0.4, repeat: isPlaying ? Infinity : 0, repeatType: 'reverse', ease: 'easeInOut', delay: i * 0.02 }} sx={{ flexGrow: 1, height: '5px', borderRadius: '2px', bgcolor: i % 3 === 0 ? alpha(theme.palette.primary.main, 0.8) : i % 3 === 1 ? alpha(theme.palette.primary.light, 0.6) : alpha(theme.palette.primary.dark, 0.7), transition: 'background-color 0.3s ease', '&:hover': { bgcolor: theme.palette.primary.main, } }} /> ))}
            </Box>
          </Box>
          {/* Progress bar */}
          <AudioProgress isPlaying={isPlaying} progress={progress} onSeek={handleSeek} duration={duration} />
          {/* Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 1, sm: 2 }, mt: 2 }} >
            <IconButton onClick={() => skip(-10)} sx={{ color: theme.palette.text.primary, '&:hover': { color: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.1), } }} > <SkipPrevious /> </IconButton>
            <IconButton onClick={togglePlayPause} sx={{ width: 56, height: 56, bgcolor: theme.palette.primary.main, color: 'white', '&:hover': { bgcolor: theme.palette.primary.dark, } }} > {isPlaying ? <Pause /> : <PlayArrow />} </IconButton>
            <IconButton onClick={() => skip(10)} sx={{ color: theme.palette.text.primary, '&:hover': { color: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.1), } }} > <SkipNext /> </IconButton>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

// Timeline Point Component
const TimelinePoint = ({ time, content, type, delay = 0 }) => {
  const theme = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const getTypeProps = () => { /* ... switch statement ... */ switch (type) { case 'agenda': return { icon: <FormatListBulleted fontSize="small" />, color: theme.palette.primary.main, bgColor: alpha(theme.palette.primary.main, 0.1) }; case 'decision': return { icon: <Lightbulb fontSize="small" />, color: theme.palette.warning.main, bgColor: alpha(theme.palette.warning.main, 0.1) }; case 'action': return { icon: <AssignmentTurnedIn fontSize="small" />, color: theme.palette.success.main, bgColor: alpha(theme.palette.success.main, 0.1) }; case 'quote': return { icon: <FormatQuote fontSize="small" />, color: theme.palette.secondary.main, bgColor: alpha(theme.palette.secondary.main, 0.1) }; default: return { icon: <Comment fontSize="small" />, color: theme.palette.info.main, bgColor: alpha(theme.palette.info.main, 0.1) }; } };
  const { icon, color, bgColor } = getTypeProps();

  return (
    <Box ref={ref} sx={{ mb: 4, display: 'flex' }}>
      {/* Timeline line and dot */}
      <Box sx={{ position: 'relative', mr: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ position: 'absolute', top: 12, bottom: -16, width: 2, bgcolor: theme.palette.divider, zIndex: 0 }} />
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }} transition={{ duration: 0.3, delay: delay * 0.1 }} >
          <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, zIndex: 1, position: 'relative' }} > {icon} </Box>
        </motion.div>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, fontFamily: 'monospace', fontWeight: 600, whiteSpace: 'nowrap' }} > {time} </Typography>
      </Box>
      {/* Content */}
      <Box sx={{ flex: 1 }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }} transition={{ duration: 0.4, delay: delay * 0.1 + 0.2 }} >
          <Card elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: theme.palette.divider, position: 'relative', overflow: 'visible', bgcolor: 'background.paper', '&:hover': { borderColor: color, boxShadow: `0 4px 20px ${alpha(color, 0.15)}`, }, '&::before': { content: '""', position: 'absolute', left: -8, top: 12, width: 12, height: 12, bgcolor: 'background.paper', transform: 'rotate(45deg)', borderBottom: '1px solid', borderLeft: '1px solid', borderColor: theme.palette.divider, zIndex: 0 } }} >
            <Typography variant="body1" component="div"> {content} </Typography>
            {type === 'action' && ( <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, pt: 1, borderTop: '1px dashed', borderColor: alpha(theme.palette.success.main, 0.3) }} > <Chip icon={<Person fontSize="small" />} label="John" size="small" sx={{ mr: 1, bgcolor: alpha(theme.palette.info.main, 0.1) }} /> <Chip icon={<Schedule fontSize="small" />} label="Due May 21" size="small" sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }} /> <Box sx={{ ml: 'auto' }}> <Tooltip title="Mark as complete"> <IconButton size="small" color="success"> <CheckCircle fontSize="small" /> </IconButton> </Tooltip> </Box> </Box> )}
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
};

// Animated Section Component
const AnimatedSection = ({ title, icon, color, children, delay = 0 }) => {
  const theme = useTheme(); const ref = useRef(null); const isInView = useInView(ref, { once: true, margin: "-50px 0px" });
  return ( <Box ref={ref} sx={{ mb: 5 }}> <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.6, delay: delay * 0.2 }} > <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}> <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 2, bgcolor: alpha(color, 0.1), color: color, mr: 2 }} > {icon} </Box> <Typography variant="h5" fontWeight={600} color="text.primary"> {title} </Typography> <Box sx={{ ml: 3, height: 4, borderRadius: 2, bgcolor: alpha(color, 0.15), flexGrow: 1 }} /> </Box> <Box sx={{ ml: 2 }}> {children} </Box> </motion.div> </Box> );
};

// Tag component for transcription highlights
const Tag = ({ children, color, bgColor, delay = 0 }) => {
  const ref = useRef(null); const isInView = useInView(ref, { once: true });
  return ( <Box component={motion.span} ref={ref} initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={{ duration: 0.3, delay: delay * 0.1 }} sx={{ display: 'inline-block', borderRadius: 1, px: 1, py: 0.5, mx: 0.5, my: 0.5, bgcolor: bgColor, color: color, fontWeight: 500, fontSize: '0.9em', }} > {children} </Box> );
};

// Tab Panel component
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return ( <Box role="tabpanel" hidden={value !== index} id={`meeting-tabpanel-${index}`} aria-labelledby={`meeting-tab-${index}`} {...other} sx={{ mt: 3 }} > <AnimatePresence mode="wait"> {value === index && ( <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} > {children} </motion.div> )} </AnimatePresence> </Box> );
};


// ============================
// Main MeetingDetails Component
// ============================
const MeetingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Destructure loadMeeting with useCallback hook if it causes re-renders in useEffect dependency array
  const { loadMeeting: contextLoadMeeting, currentMeeting, loading, error, removeMeeting } = useMeeting();
  const [activeTab, setActiveTab] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareMenuAnchor, setShareMenuAnchor] = useState(null);
  const [actionsMenuAnchor, setActionsMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Memoize loadMeeting if necessary, though context functions are usually stable
  const loadMeeting = useCallback(contextLoadMeeting, [contextLoadMeeting]);

  useEffect(() => {
    if (id) {
        console.log(`MeetingDetails Effect: Calling loadMeeting for ID: ${id}`);
        loadMeeting(id);
    } else {
        console.error("MeetingDetails Effect: No meeting ID provided in URL.");
        // Optionally navigate back or show an error
    }
  }, [id, loadMeeting]); // Dependency array includes loadMeeting


  const handleDeleteMeeting = async () => {
    handleCloseActionsMenu(); // Close menu first
    if (window.confirm('Are you sure you want to delete this meeting and all its data? This cannot be undone.')) {
      const deleted = await removeMeeting(id);
      if (deleted) {
        console.log("MeetingDetails: Meeting deleted successfully, navigating to dashboard.");
        navigate('/');
      } else {
          console.error("MeetingDetails: Failed to delete meeting.");
          // Error state should be set in context, maybe show a snackbar here
      }
    }
  };

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenShareMenu = (event) => setShareMenuAnchor(event.currentTarget);
  const handleCloseShareMenu = () => setShareMenuAnchor(null);
  const handleOpenActionsMenu = (event) => setActionsMenuAnchor(event.currentTarget);
  const handleCloseActionsMenu = () => setActionsMenuAnchor(null);

  const shareOptions = [ /* ... share options ... */ { icon: <Email fontSize="small" />, label: 'Email', onClick: () => {} }, { icon: <ContentCopy fontSize="small" />, label: 'Copy Link', onClick: () => {} }, { icon: <Public fontSize="small" />, label: 'Publish to Web', onClick: () => {} } ];


  // --- Conditional Returns (Early Exits) ---
  // These MUST be inside the component function body, before the main return
  console.log(`MeetingDetails Render Check: loading=${loading}, error=${error}, currentMeeting exists=${!!currentMeeting}`);

  if (loading) {
    // Consistent Loading Indicator
    return (
        <Container maxWidth="sm" sx={{ py: 15, textAlign: 'center' }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 3 }}> Loading Meeting Details... </Typography>
        </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} > Error loading meeting: {error} </Alert>
        <Button component={RouterLink} to="/" startIcon={<ArrowBack />} > Return to Dashboard </Button>
      </Container>
    );
  }

  if (!currentMeeting) {
    // This handles the case after loading=false but data is still null (e.g., not found or access denied caught by loadMeeting)
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
         <Alert severity="warning" sx={{ mb: 2, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} >
             Meeting not found or could not be loaded. It might have been deleted or there was an issue fetching details.
         </Alert>
         <Button component={RouterLink} to="/" startIcon={<ArrowBack />} > Return to Dashboard </Button>
       </Container>
    );
  }
  // --- End Conditional Returns ---


  // --- Data Preparation (Only if currentMeeting exists) ---
  const minutesData = currentMeeting.minutesData || {}; // Default to empty object for safer access
  const hasMinutesError = !!minutesData?.error; // Check if minutes loading failed

  const formattedDate = currentMeeting.createdAt?.toDate()
    ? moment(currentMeeting.createdAt.toDate()).format('MMMM D, YYYY')
    : 'Date unavailable';
  const formattedTime = currentMeeting.createdAt?.toDate()
    ? moment(currentMeeting.createdAt.toDate()).format('h:mm A')
    : '';

  // Simulated action items (replace with real data from minutesData if available)
  const actionItems = minutesData?.actionItems?.map((item, index) => ({ // Example if actionItems is an array of strings
      content: item, // Assuming item is like "[Assignee] Task [Due: Date]"
      // Basic parsing attempt (replace with robust logic if format is consistent)
      assignee: item.match(/\[(.*?)\]/)?.[1] || 'Unassigned',
      dueDate: item.match(/\[Due: (.*?)\]/)?.[1] || 'No Due Date',
      complete: false // Add logic if completion status is stored
  })) || [ /* Default placeholder items if needed */ { content: "Review project timeline", assignee: "John", dueDate: "May 21", complete: false }, { content: "Schedule design sync", assignee: "Sarah", dueDate: "May 18", complete: true }, { content: "Share notes", assignee: "Michael", dueDate: "May 16", complete: false } ];


  // --- Main Component Return ---
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', background: theme.palette.background.default, pb: 8 }} >
      {/* Background decoration */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', background: `radial-gradient(circle at 15% 15%, ${alpha(theme.palette.primary.main, 0.07)} 0%, transparent 70%)`, zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: 3 }}>
        {/* Back button and meeting header */}
        <Box sx={{ mb: 4 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} >
            <Button component={RouterLink} to="/" startIcon={<ArrowBack />} sx={{ mb: 2 }} > Back to Dashboard </Button>
          </motion.div>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }} >
            {/* Left Side: Title & Chips */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} >
                  <Typography variant="h4" component="h1" fontWeight={700} sx={{ background: `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${theme.palette.primary.main} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mr: 1 }} >
                    {currentMeeting.title || 'Meeting Details'}
                  </Typography>
                </motion.div>
                <IconButton onClick={() => setIsBookmarked(!isBookmarked)} sx={{ color: isBookmarked ? 'warning.main' : 'text.disabled', '&:hover': { color: isBookmarked ? 'warning.dark' : 'text.primary', } }} > {isBookmarked ? <Bookmark /> : <BookmarkBorder />} </IconButton>
              </Box>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  <Chip icon={<CalendarToday fontSize="small" />} label={formattedDate} size="small" sx={{ bgcolor: 'background.paper' }} />
                  {formattedTime && ( <Chip icon={<AccessTime fontSize="small" />} label={formattedTime} size="small" sx={{ bgcolor: 'background.paper' }} /> )}
                  <Chip icon={<People fontSize="small" />} label={`${minutesData?.participants || 'Team members'}`} size="small" sx={{ bgcolor: 'background.paper' }} />
                </Box>
              </motion.div>
            </Box>
             {/* Right Side: Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, alignSelf: { xs: 'flex-end', sm: 'auto' } }} >
               <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} > <Button variant="outlined" startIcon={<ShareIcon />} onClick={handleOpenShareMenu} sx={{ borderRadius: 2 }} > Share </Button> </motion.div>
               <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} > <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderRadius: 2 }} > Export </Button> </motion.div>
               <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }} > <IconButton onClick={handleOpenActionsMenu} sx={{ bgcolor: 'background.paper', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid', borderColor: theme.palette.divider, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05), } }} > <MoreVert /> </IconButton> </motion.div>
            </Box>
          </Box>
        </Box>

        {/* Main content with tabs */}
        <Box sx={{ mt: 4 }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
             <Tabs value={activeTab} onChange={handleChangeTab} variant={isMobile ? "scrollable" : "fullWidth"} scrollButtons={isMobile ? "auto" : false} allowScrollButtonsMobile sx={{ '& .MuiTab-root': { py: 2, fontWeight: 600, textTransform: 'none', minWidth: 0 }, '& .Mui-selected': { color: `${theme.palette.primary.main} !important`, } }} >
                 <Tab label="Minutes" icon={<NoteAlt />} iconPosition="start" disabled={hasMinutesError}/>
                 <Tab label="Transcript" icon={<Comment />} iconPosition="start" />
                 <Tab label="Action Items" icon={<AssignmentTurnedIn />} iconPosition="start" disabled={hasMinutesError} />
                 <Tab label="Recording" icon={<MicNone />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* Display Error if Minutes Failed to Load */}
          {hasMinutesError && activeTab !== 3 && activeTab !== 1 && ( // Show error on relevant tabs
              <Alert severity="warning" sx={{ mt: 3 }}>
                  Could not load the structured minutes details for this meeting ({minutesData.error}). You can still view the full transcript and listen to the recording.
              </Alert>
          )}

          {/* Minutes Tab */}
          <TabPanel value={activeTab} index={0}>
             {!hasMinutesError ? (
                 <Card sx={{ borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.05)', }} >
                     <CardContent sx={{ p: 4 }}>
                       {/* Overview Section */}
                       <AnimatedSection title="Meeting Overview" icon={<People />} color={theme.palette.primary.main} delay={0} >
                           <Box sx={{ p: 3, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.1), mb: 4 }} >
                             <Grid container spacing={3}>
                               <Grid item xs={12} md={4}> <Typography variant="subtitle2" color="text.secondary" gutterBottom> Date & Time </Typography> <Typography variant="body1"> {formattedDate}, {formattedTime} </Typography> </Grid>
                               <Grid item xs={12} md={4}> <Typography variant="subtitle2" color="text.secondary" gutterBottom> Participants </Typography> <Typography variant="body1"> {minutesData.participants || 'N/A'} </Typography> </Grid>
                               <Grid item xs={12} md={4}> <Typography variant="subtitle2" color="text.secondary" gutterBottom> Duration </Typography> <Typography variant="body1"> {minutesData.duration || 'N/A'} </Typography> </Grid>
                             </Grid>
                           </Box>
                           {/* Agenda */}
                           {minutesData.agenda && ( <Box sx={{ mb: 4 }}> <Typography variant="h6" fontWeight={600} gutterBottom> Agenda </Typography> <Typography variant="body1" component="div"> {(minutesData.agenda || '').split('\n').map((line, index) => ( <Typography key={index} variant="body1" component="p" sx={{ mb: 1, display: 'flex', alignItems: 'center', '&::before': { content: '""', display: 'inline-block', width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.primary.main, mr: 2 } }} > {line} </Typography> ))} </Typography> </Box> )}
                        </AnimatedSection>
                        {/* Key Points */}
                         {minutesData.keyPoints && ( <AnimatedSection title="Key Discussion Points" icon={<Comment />} color={theme.palette.info.main} delay={1} > <Typography variant="body1" component="div"> {(minutesData.keyPoints || '').split('\n').map((line, index) => ( <Typography key={index} variant="body1" component="p" sx={{ mb: 1.5 }} > {line} </Typography> ))} </Typography> </AnimatedSection> )}
                         {/* Decisions */}
                         {minutesData.decisions && ( <AnimatedSection title="Decisions Made" icon={<Lightbulb />} color={theme.palette.warning.main} delay={2} > <Box sx={{ p: 3, borderRadius: 3, bgcolor: alpha(theme.palette.warning.main, 0.05), border: '1px solid', borderColor: alpha(theme.palette.warning.main, 0.1), mb: 3 }} > <Typography variant="body1" component="div"> {(minutesData.decisions || []).map((line, index) => ( <Box key={index} sx={{ display: 'flex', mb: 2, '&:last-child': { mb: 0 } }} > <CheckCircle sx={{ color: theme.palette.success.main, mr: 2, mt: 0.3, flexShrink: 0 }} /> <Typography variant="body1"> {line} </Typography> </Box> ))} </Typography> </Box> </AnimatedSection> )}
                         {/* Action Items (Using parsed or simulated data) */}
                         {actionItems.length > 0 && ( <AnimatedSection title="Action Items" icon={<AssignmentTurnedIn />} color={theme.palette.success.main} delay={3} > <Box sx={{ borderRadius: 3, border: '1px solid', borderColor: theme.palette.divider, overflow: 'hidden', mb: 3 }} > {actionItems.map((item, index) => ( <Box key={index} sx={{ p: 2, bgcolor: 'background.paper', borderBottom: index < actionItems.length - 1 ? '1px solid' : 'none', borderColor: theme.palette.divider, display: 'flex', alignItems: 'center', gap: 2 }} > <Avatar sx={{ width: 32, height: 32, bgcolor: item.complete ? theme.palette.success.main : theme.palette.primary.main }} > {item.assignee?.[0] || '?'} </Avatar> <Box sx={{ flexGrow: 1 }}> <Typography variant="body1" sx={{ textDecoration: item.complete ? 'line-through' : 'none', color: item.complete ? 'text.secondary' : 'text.primary' }} > {item.content} </Typography> <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}> <Typography variant="caption" color="text.secondary"> Assigned to: <span style={{ fontWeight: 600 }}>{item.assignee}</span> </Typography> <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} /> <Typography variant="caption" color="text.secondary"> Due: <span style={{ fontWeight: 600 }}>{item.dueDate}</span> </Typography> </Box> </Box> <Chip label={item.complete ? "Completed" : "Pending"} size="small" color={item.complete ? "success" : "default"} sx={{ fontWeight: 500, height: 24 }} /> </Box> ))} </Box> </AnimatedSection> )}
                         {/* Next Steps */}
                         {minutesData.nextSteps && ( <AnimatedSection title="Next Steps" icon={<Schedule />} color={theme.palette.secondary.main} delay={4} > <Typography variant="body1" component="div"> {(minutesData.nextSteps || '').split('\n').map((line, index) => ( <Typography key={index} variant="body1" component="p" sx={{ mb: 1.5 }} > {line} </Typography> ))} </Typography> </AnimatedSection> )}
                    </CardContent>
                 </Card>
             ) : null /* Render nothing or placeholder if minutes error */}
          </TabPanel>

           {/* Transcript Tab */}
           <TabPanel value={activeTab} index={1}>
             <Card sx={{ borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.05)', }} >
               <CardContent sx={{ p: 4 }}>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }} > <Typography variant="h5" fontWeight={600}> Full Transcript </Typography> <Button variant="outlined" size="small" startIcon={<DownloadIcon />} sx={{ borderRadius: 2 }} > Download </Button> </Box>
                 {minutesData?.transcription ? ( <Box sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: theme.palette.divider, bgcolor: alpha(theme.palette.background.paper, 0.6), maxHeight: '60vh', overflow: 'auto' }} >
                     {/* Using Typography with whiteSpace for simplicity */}
                     <Typography variant="body1" component="div" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                         {minutesData.transcription}
                     </Typography>
                 </Box> ) : ( <Box sx={{ textAlign: 'center', py: 6 }}> <Typography variant="body1" color="text.secondary"> Transcript not available. </Typography> </Box> )}
               </CardContent>
             </Card>
           </TabPanel>

          {/* Action Items Tab (Timeline View) */}
          <TabPanel value={activeTab} index={2}>
            {!hasMinutesError ? (
                <Card sx={{ borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.05)', }} >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }} > <Typography variant="h5" fontWeight={600}> Action Items Timeline </Typography> <Button variant="outlined" size="small" startIcon={<ShareIcon />} sx={{ borderRadius: 2 }} > Share Tasks </Button> </Box>
                    <Box sx={{ ml: 2 }}>
                      {/* Map over parsed action items if available, or use simulated */}
                      {actionItems.length > 0 ? actionItems.map((item, index) => (
                          <TimelinePoint key={index} time={`Task ${index + 1}`} // Replace with actual time if available
                           content={`${item.content} (Assignee: ${item.assignee}, Due: ${item.dueDate})`} type="action" delay={index + 1} />
                      )) : (
                          <Typography color="text.secondary">No action items identified.</Typography>
                      )}
                      {/* Add other timeline points for decisions etc. if desired */}
                    </Box>
                  </CardContent>
                </Card>
            ) : null /* Render nothing or placeholder if minutes error */}
          </TabPanel>

          {/* Recording Tab */}
          <TabPanel value={activeTab} index={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.05)', }} >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 4 }}> Meeting Recording </Typography>
                {currentMeeting.audioUrl ? ( <AudioPlayer audioUrl={currentMeeting.audioUrl} /> ) : ( <Box sx={{ textAlign: 'center', py: 6 }}> <Typography variant="body1" color="text.secondary"> Audio recording not available. </Typography> </Box> )}
              </CardContent>
            </Card>
          </TabPanel>

        </Box>
      </Container>

      {/* Share Menu */}
       <Menu anchorEl={shareMenuAnchor} open={Boolean(shareMenuAnchor)} onClose={handleCloseShareMenu} PaperProps={{ elevation: 3, sx: { mt: 1.5, borderRadius: 2, minWidth: 180, } }} > {shareOptions.map((option) => ( <MenuItem key={option.label} onClick={() => { option.onClick(); handleCloseShareMenu(); }} > <ListItemIcon>{option.icon}</ListItemIcon> {option.label} </MenuItem> ))} </Menu>
      {/* Actions Menu */}
       <Menu anchorEl={actionsMenuAnchor} open={Boolean(actionsMenuAnchor)} onClose={handleCloseActionsMenu} PaperProps={{ elevation: 3, sx: { mt: 1.5, borderRadius: 2, minWidth: 180, } }} > <MenuItem onClick={handleCloseActionsMenu}> <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon> Edit Minutes </MenuItem> <MenuItem onClick={handleCloseActionsMenu}> <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon> Download PDF </MenuItem> <Divider /> <MenuItem onClick={handleDeleteMeeting} sx={{ color: theme.palette.error.main }} > <ListItemIcon> <DeleteIcon fontSize="small" color="error" /> </ListItemIcon> Delete Meeting </MenuItem> </Menu>
    </Box>
  );
};

export default MeetingDetails;