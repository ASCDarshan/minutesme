import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Grid } from "@mui/material";
import { useMeeting } from "../context/MeetingContext";

const MeetingList = () => {
  const { meetings, loading, error } = useMeeting();

  if (loading) {
    return <Typography>Loading meetings...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!meetings || meetings.length === 0) {
    return (
      <Typography>No meetings found. Create your first meeting!</Typography>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {meetings.map((meeting) => (
          <Grid item xs={12} sm={6} md={4} key={meeting.id}>
            <Box
              component={RouterLink}
              to={`/meeting/${meeting.id}`}
              sx={{
                display: "block",
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                textDecoration: "none",
                color: "text.primary",
                "&:hover": {
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Typography variant="h6">{meeting.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {meeting.createdAt
                  ? new Date(meeting.createdAt.seconds * 1000).toLocaleString()
                  : "Date unavailable"}
              </Typography>
              <Typography variant="body2">
                Status: {meeting.status || "Unknown"}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MeetingList;
