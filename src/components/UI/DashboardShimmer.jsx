import React from "react";
import {
    Box,
    Skeleton,
    Stack,
    Grid,
    Paper,
    Divider,
} from "@mui/material";

const DashboardShimmer = () => {
    return (
        <Box sx={{ px: 4, py: 3 }}>
            {/* Header Greeting */}
            <Skeleton variant="text" width={280} height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={340} height={24} sx={{ mb: 4 }} />

            {/* Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                {[...Array(4)].map((_, idx) => (
                    <Grid item xs={12} sm={6} md={3} key={idx}>
                        <Skeleton
                            variant="rounded"
                            height={110}
                            sx={{ borderRadius: 6 }}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Search & Action Bar */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 6,
                    px: 3,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                }}
            >
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Skeleton variant="text" width={120} height={28} />
                    <Skeleton variant="circular" width={22} height={22} />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Skeleton variant="rounded" width={200} height={36} />
                    <Skeleton variant="rounded" width={40} height={36} />
                    <Skeleton variant="rounded" width={40} height={36} />
                    <Skeleton variant="rounded" width={120} height={40} />
                </Stack>
            </Paper>

            {/* Meeting List Card */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 6,
                    px: 3,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box>
                        <Skeleton variant="text" width={100} height={24} />
                        <Skeleton variant="text" width={180} height={20} />
                    </Box>
                </Stack>
                <Skeleton variant="rounded" width={80} height={28} />
            </Paper>
        </Box>
    );
};

export default DashboardShimmer;
