import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Transcription = ({ text }) => {
  if (!text) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No transcription available.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        maxHeight: '500px',
        overflow: 'auto'
      }}
    >
      <Typography variant="body1" component="div">
        {text.split('\n').map((paragraph, index) => (
          <Typography key={index} paragraph>
            {paragraph}
          </Typography>
        ))}
      </Typography>
    </Paper>
  );
};

export default Transcription;