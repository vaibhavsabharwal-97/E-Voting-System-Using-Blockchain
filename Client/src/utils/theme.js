import { createTheme } from '@mui/material/styles';

// Indian Election Theme Colors
const indianColors = {
  saffron: '#FF9933',
  white: '#FFFFFF',
  green: '#138808',
  navy: '#000080',
  lightSaffron: '#FFB366',
  lightGreen: '#4DAA4D',
  lightNavy: '#4D4DCC',
};

const lightPalette = {
  primary: {
    main: indianColors.saffron,
    light: indianColors.lightSaffron,
    dark: '#E6851A',
    contrastText: '#fff',
  },
  secondary: {
    main: indianColors.green,
    light: indianColors.lightGreen,
    dark: '#0D5A05',
    contrastText: '#fff',
  },
  tertiary: {
    main: indianColors.navy,
    light: indianColors.lightNavy,
    dark: '#000066',
    contrastText: '#fff',
  },
  background: {
    default: '#f8f9fa',
    paper: '#ffffff',
    sidebar: '#ffffff',
    government: indianColors.navy,
    saffron: indianColors.saffron,
    green: indianColors.green,
  },
  text: {
    primary: indianColors.navy,
    secondary: '#4a5568',
    disabled: '#a0aec0',
    government: indianColors.navy,
    saffron: indianColors.saffron,
    green: indianColors.green,
  },
  success: {
    main: indianColors.green,
    light: '#4fd1c5',
    dark: '#0D5A05',
    contrastText: '#fff',
  },
  error: {
    main: '#e53e3e',
    light: '#fc8181',
    dark: '#c53030',
    contrastText: '#fff',
  },
  warning: {
    main: indianColors.saffron,
    light: indianColors.lightSaffron,
    dark: '#E6851A',
    contrastText: '#fff',
  },
  info: {
    main: indianColors.navy,
    light: indianColors.lightNavy,
    dark: '#000066',
    contrastText: '#fff',
  },
  divider: 'rgba(0, 0, 128, 0.12)',
  indian: {
    saffron: indianColors.saffron,
    white: indianColors.white,
    green: indianColors.green,
    navy: indianColors.navy,
    lightSaffron: indianColors.lightSaffron,
    lightGreen: indianColors.lightGreen,
    lightNavy: indianColors.lightNavy,
  },
};

const darkPalette = {
  primary: {
    main: indianColors.saffron,
    light: indianColors.lightSaffron,
    dark: '#E6851A',
    contrastText: '#fff',
  },
  secondary: {
    main: indianColors.green,
    light: indianColors.lightGreen,
    dark: '#0D5A05',
    contrastText: '#fff',
  },
  tertiary: {
    main: indianColors.lightNavy,
    light: '#8080FF',
    dark: indianColors.navy,
    contrastText: '#fff',
  },
  background: {
    default: '#1a202c',
    paper: '#2d3748',
    sidebar: '#171923',
    government: '#2d3748',
    saffron: indianColors.saffron,
    green: indianColors.green,
  },
  text: {
    primary: '#f7fafc',
    secondary: '#e2e8f0',
    disabled: '#a0aec0',
    government: '#f7fafc',
    saffron: indianColors.lightSaffron,
    green: indianColors.lightGreen,
  },
  success: {
    main: indianColors.lightGreen,
    light: '#4fd1c5',
    dark: indianColors.green,
    contrastText: '#fff',
  },
  error: {
    main: '#e53e3e',
    light: '#fc8181',
    dark: '#c53030',
    contrastText: '#fff',
  },
  warning: {
    main: indianColors.lightSaffron,
    light: '#FFD6B3',
    dark: indianColors.saffron,
    contrastText: '#fff',
  },
  info: {
    main: indianColors.lightNavy,
    light: '#8080FF',
    dark: indianColors.navy,
    contrastText: '#fff',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
  indian: {
    saffron: indianColors.lightSaffron,
    white: indianColors.white,
    green: indianColors.lightGreen,
    navy: indianColors.lightNavy,
    lightSaffron: indianColors.lightSaffron,
    lightGreen: indianColors.lightGreen,
    lightNavy: indianColors.lightNavy,
  },
};

const getTheme = (mode) => {
  const palette = mode === 'light' ? lightPalette : darkPalette;
  
  return createTheme({
    palette: {
      mode,
      ...palette,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        color: palette.text.government,
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
        color: palette.text.government,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
        color: palette.text.government,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        color: palette.text.government,
      },
      h5: {
        fontWeight: 500,
        fontSize: '1.25rem',
      },
      h6: {
        fontWeight: 500,
        fontSize: '1rem',
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 400,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: '1rem',
      },
      body2: {
        fontSize: '0.875rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 20px',
            fontSize: '0.95rem',
          },
          containedPrimary: {
            backgroundColor: indianColors.saffron,
            color: '#ffffff',
            boxShadow: `0 4px 14px 0 rgba(255, 153, 51, 0.39)`,
            '&:hover': {
              backgroundColor: '#E6851A',
              boxShadow: `0 6px 20px 0 rgba(255, 153, 51, 0.5)`,
            },
          },
          containedSecondary: {
            backgroundColor: indianColors.green,
            color: '#ffffff',
            boxShadow: `0 4px 14px 0 rgba(19, 136, 8, 0.39)`,
            '&:hover': {
              backgroundColor: '#0D5A05',
              boxShadow: `0 6px 20px 0 rgba(19, 136, 8, 0.5)`,
            },
          },
          outlined: {
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
            },
          },
          outlinedPrimary: {
            borderColor: indianColors.saffron,
            color: indianColors.saffron,
            '&:hover': {
              borderColor: indianColors.saffron,
              backgroundColor: `rgba(255, 153, 51, 0.08)`,
            },
          },
          outlinedSecondary: {
            borderColor: indianColors.green,
            color: indianColors.green,
            '&:hover': {
              borderColor: indianColors.green,
              backgroundColor: `rgba(19, 136, 8, 0.08)`,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: mode === 'light' ? `1px solid rgba(255, 153, 51, 0.2)` : 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'light' 
              ? '0px 4px 20px rgba(0, 0, 128, 0.08)' 
              : '0px 4px 20px rgba(0, 0, 0, 0.25)',
            border: mode === 'light' ? `1px solid rgba(255, 153, 51, 0.15)` : 'none',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0px 8px 28px rgba(0, 0, 128, 0.12)'
                : '0px 8px 28px rgba(0, 0, 0, 0.35)',
              border: mode === 'light' ? `1px solid rgba(255, 153, 51, 0.3)` : 'none',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '& fieldset': {
                borderColor: mode === 'light' ? 'rgba(0, 0, 128, 0.23)' : 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: indianColors.saffron,
              },
              '&.Mui-focused fieldset': {
                borderColor: indianColors.saffron,
                borderWidth: '2px',
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: indianColors.navy,
            color: '#ffffff',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
          colorPrimary: {
            backgroundColor: indianColors.saffron,
            color: '#ffffff',
          },
          colorSecondary: {
            backgroundColor: indianColors.green,
            color: '#ffffff',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? indianColors.navy : palette.background.paper,
            '& .MuiTableCell-head': {
              color: mode === 'light' ? '#ffffff' : palette.text.primary,
              fontWeight: 600,
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'light' ? '#ffffff' : palette.background.sidebar,
            borderRight: `1px solid ${mode === 'light' ? 'rgba(255, 153, 51, 0.2)' : 'rgba(255, 255, 255, 0.12)'}`,
          },
        },
      },
    },
  });
};

export default getTheme; 