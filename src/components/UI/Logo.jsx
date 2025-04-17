import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

// Logo sizes
const sizes = {
  small: {
    width: 32,
    height: 32,
    fontSize: '1rem',
  },
  medium: {
    width: 40,
    height: 40,
    fontSize: '1.25rem',
  },
  large: {
    width: 48,
    height: 48,
    fontSize: '1.5rem',
  },
  xlarge: {
    width: 64,
    height: 64,
    fontSize: '2rem',
  },
};

const Logo = ({ size = 'medium', withText = true, textColor }) => {
  const theme = useTheme();
  const dimensions = sizes[size] || sizes.medium;
  
  // Use provided text color or default to primary
  const logoTextColor = textColor || theme.palette.primary.main;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box 
        component="svg"
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        sx={{ flexShrink: 0 }}
      >
        {/* Circle background */}
        <circle cx="32" cy="32" r="30" fill={theme.palette.primary.main} />
        <circle cx="32" cy="32" r="25" fill="white" />
        
        {/* Clock hands */}
        <path
          d="M32 32L32 14"
          stroke={theme.palette.primary.main}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M32 32L45 40"
          stroke={theme.palette.primary.main}
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Speech bubble overlay */}
        <path
          d="M50 30C50 38.2843 41.9411 45 32 45C27.0588 45 22.5294 43.4559 19.224 40.9094L12 45L14.5 37.8C13.0148 35.4418 12.1176 32.8127 12 30C12 21.7157 20.0589 15 30 15C39.9411 15 50 21.7157 50 30Z"
          fill={`${theme.palette.primary.main}40`} // Add 40 for 25% opacity
          stroke={theme.palette.primary.main}
          strokeWidth="2"
        />
        
        {/* Horizontal lines representing text in the speech bubble */}
        <line
          x1="20"
          y1="25"
          x2="40"
          y2="25"
          stroke={theme.palette.primary.main}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="20"
          y1="31"
          x2="36"
          y2="31"
          stroke={theme.palette.primary.main}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="20"
          y1="37"
          x2="32"
          y2="37"
          stroke={theme.palette.primary.main}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Box>
      
      {withText && (
        <Typography
          variant="h6"
          component="span"
          sx={{
            marginLeft: 1,
            fontWeight: 700,
            fontSize: dimensions.fontSize,
            color: logoTextColor,
            letterSpacing: '-0.01em',
          }}
        >
          Minute<span style={{ color: theme.palette.secondary.main }}>Me</span>
        </Typography>
      )}
    </Box>
  );
};

export default Logo;