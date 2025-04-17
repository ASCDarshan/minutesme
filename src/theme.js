import { createTheme, alpha } from '@mui/material/styles';

// Soft lavender color palette
const lavender = {
  50: '#f3f1fa',
  100: '#e5e0f5',
  200: '#d2c8ed',
  300: '#b9a7e2',
  400: '#a288d9',
  500: '#8a68cf',
  600: '#7855c0',
  700: '#6c49ab',
  800: '#5b3f8c',
  900: '#4b3471',
};

const teal = {
  50: '#e8f7f7',
  100: '#d0eeef',
  200: '#a3dde0',
  300: '#75cccf',
  400: '#48bcbf',
  500: '#35a0a3',
  600: '#2a8185',
  700: '#23676a',
  800: '#1d4e51',
  900: '#172f30',
};

// MUI Default Shadows (for reference and inclusion)
const defaultShadows = [
  'none',
  '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
  '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
  '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
  '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
  '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
  '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
  '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
  '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
  '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
  '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
  '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
  '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
  '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
  '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
  '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
  '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
  '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
  '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
];

// Create our theme
const theme = createTheme({
  palette: {
    primary: {
      main: lavender[500],
      light: lavender[300],
      dark: lavender[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: teal[500],
      light: teal[300],
      dark: teal[700],
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
      subtle: lavender[50],
    },
    success: {
      main: '#4caf50',
      light: '#80e27e',
      dark: '#087f23',
    },
    error: {
      main: '#f44336',
      light: '#ff7961',
      dark: '#ba000d',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  // Use the complete default shadows array
  shadows: defaultShadows,
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({ // Use theme access here if needed
          borderRadius: 8,
          padding: '10px 16px',
          // Apply base shadow based on variant/elevation if needed, or leave default
          // boxShadow: theme.shadows[ownerState.elevation || 0], // Example if buttons had elevation
          boxShadow: 'none', // Explicitly none unless hovered/contained
          '&:hover': {
             // Consider using theme.shadows[1] or theme.shadows[2] for hover
             boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        }),
        contained: ({ theme }) => ({ // Use theme access here
          // Default contained button shadow is usually theme.shadows[2]
          // boxShadow: theme.shadows[2], // Uncomment if you want default elevation shadow
          '&:hover': {
            // Default contained button hover shadow is usually theme.shadows[4]
            // boxShadow: theme.shadows[4], // Uncomment if you want default elevation shadow
             boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Your custom hover shadow
          },
        }),
        containedPrimary: {
          // Keep your gradient background
          background: `linear-gradient(135deg, ${lavender[400]} 0%, ${lavender[600]} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${lavender[500]} 0%, ${lavender[700]} 100%)`,
            // Ensure hover shadow for contained primary is defined if needed
             boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Your custom hover shadow
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({ // Use theme access here
           // Apply shadow based on the elevation prop passed to the Paper component
           // The default behavior is restored by NOT setting boxShadow here,
           // as MUI applies theme.shadows[ownerState.elevation] automatically.
           // If you MUST override, use: boxShadow: theme.shadows[ownerState.elevation || 0],
           // Your previous override was applying the same shadow regardless of elevation:
           // boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // This ignores the elevation prop
        }),
        outlined: {
          borderColor: lavender[100],
        },
      },
    },
    MuiAppBar: {
       defaultProps: {
         elevation: 1, // Set a default elevation if desired, e.g., 1 or 4
       },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({ // Use theme access here
           // AppBar uses Paper internally, so it respects elevation prop.
           // Default MUI AppBar with elevation > 0 usually uses theme.shadows[4]
           // No need to set boxShadow here if using elevation prop.
           // Your previous override:
           // boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)', // This ignores elevation
        }),
      },
    },
    MuiCard: {
       defaultProps: {
         elevation: 1, // Set a default elevation (e.g., 1)
       },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({ // Use theme access here
          borderRadius: 16,
          // Card uses Paper, so it respects the elevation prop.
          // No need to set boxShadow here if using elevation prop.
          // Your previous override:
          // boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // This ignores elevation
          overflow: 'hidden',
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          borderWidth: 2,
          '&.Mui-selected': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
        },
      },
    },
  },
});

export default theme;