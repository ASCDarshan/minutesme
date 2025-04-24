import React from 'react';
import { Box, Grid, Paper, Skeleton } from '@mui/material';
import { alpha, keyframes } from '@mui/system';
import { useTheme } from '@mui/material/styles';

// Create shimmer animation keyframes
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const DashboardShimmer = ({ type = 'card', count = 1 }) => {
    const theme = useTheme();

    // Shimmer overlay styling
    const shimmerOverlay = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        animation: `${shimmer} 1.5s infinite linear`,
        background: `linear-gradient(90deg, 
      ${alpha(theme.palette.background.paper, 0)} 0%, 
      ${alpha(theme.palette.background.paper, 0.6)} 50%, 
      ${alpha(theme.palette.background.paper, 0)} 100%)`,
        backgroundSize: '200px 100%',
        zIndex: 1,
    };

    // Stat Card Skeleton
    const StatCardSkeleton = () => (
        <Grid item xs={12} sm={6} md={3}>
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.palette.divider}`,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Skeleton variant="circular" width={36} height={36} />
                    <Skeleton width={40} height={18} />
                </Box>
                <Skeleton width={90} height={24} sx={{ mb: 0.5 }} />
                <Skeleton width={60} height={35} />
                <Box sx={shimmerOverlay} />
            </Paper>
        </Grid>
    );

    // Meeting Card Skeleton
    const MeetingCardSkeleton = () => (
        <Grid item xs={12} sm={6} md={4}>
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.palette.divider}`,
                    position: 'relative',
                    overflow: 'hidden',
                    height: 180,
                }}
            >
                <Skeleton width="70%" height={28} sx={{ mb: 1 }} />
                <Skeleton width="40%" height={20} sx={{ mb: 2 }} />
                <Skeleton width="100%" height={16} sx={{ mb: 1 }} />
                <Skeleton width="90%" height={16} sx={{ mb: 1 }} />
                <Skeleton width="60%" height={16} sx={{ mb: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 1 }}>
                    <Skeleton width={80} height={32} />
                    <Skeleton width={80} height={32} />
                </Box>
                <Box sx={shimmerOverlay} />
            </Paper>
        </Grid>
    );

    // Meeting List Item Skeleton
    const MeetingListItemSkeleton = () => (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Box>
                    <Skeleton width={200} height={24} sx={{ mb: 0.5 }} />
                    <Skeleton width={120} height={16} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton width={80} height={32} sx={{ mr: 1 }} />
                <Skeleton width={80} height={32} />
            </Box>
            <Box sx={shimmerOverlay} />
        </Paper>
    );

    // Generate the right number of skeletons
    const renderSkeletons = () => {
        const skeletons = [];
        for (let i = 0; i < count; i++) {
            if (type === 'card') {
                skeletons.push(<MeetingCardSkeleton key={`card-skeleton-${i}`} />);
            } else if (type === 'statcard') {
                skeletons.push(<StatCardSkeleton key={`stat-skeleton-${i}`} />);
            } else if (type === 'list') {
                skeletons.push(<MeetingListItemSkeleton key={`list-skeleton-${i}`} />);
            }
        }
        return skeletons;
    };

    return (
        <>
            {type === 'list' ? (
                <Box>{renderSkeletons()}</Box>
            ) : (
                <Grid container spacing={3}>
                    {renderSkeletons()}
                </Grid>
            )}
        </>
    );
};

export default DashboardShimmer;