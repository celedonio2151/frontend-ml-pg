import type { Components, Theme } from '@mui/material/styles';

const CssBaseline: Components<Omit<Theme, 'components'>>['MuiCssBaseline'] = {
  styleOverrides: (theme) => ({
    html: {
      minHeight: '100%',
    },
    body: {
      minHeight: '100%',
      overflowX: 'hidden',
      backgroundColor: theme.palette.background.default,
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    '#root': {
      minHeight: '100vh',
    },
    '*': {
      boxSizing: 'border-box',
    },
    '*::-webkit-scrollbar': {
      width: 6,
      height: 6,
    },
    '*::-webkit-scrollbar-track': {
      background: theme.palette.mode === 'dark' ? '#0a1628' : '#dff7ff',
    },
    '*::-webkit-scrollbar-thumb': {
      background: theme.palette.mode === 'dark' ? 'rgba(6, 182, 212, 0.35)' : 'rgba(2, 132, 199, 0.34)',
      borderRadius: 999,
    },
    '@keyframes aquaPulseRing': {
      '0%': {
        transform: 'scale(1)',
        opacity: 0.7,
      },
      '100%': {
        transform: 'scale(2.2)',
        opacity: 0,
      },
    },
    '@keyframes aquaFloat': {
      '0%, 100%': {
        transform: 'translateY(0)',
      },
      '50%': {
        transform: 'translateY(-12px)',
      },
    },
    '@keyframes bubbleRise': {
      '0%': {
        opacity: 0,
        transform: 'translateY(22vh) scale(0.55)',
      },
      '14%': {
        opacity: theme.palette.mode === 'dark' ? 0.7 : 0.42,
      },
      '86%': {
        opacity: theme.palette.mode === 'dark' ? 0.34 : 0.2,
      },
      '100%': {
        opacity: 0,
        transform: 'translateY(-112vh) scale(1)',
      },
    },
    '@keyframes aquaPulseGlow': {
      '0%, 100%': {
        opacity: theme.palette.mode === 'dark' ? 0.35 : 0.22,
        transform: 'scale(1)',
      },
      '50%': {
        opacity: theme.palette.mode === 'dark' ? 0.8 : 0.38,
        transform: 'scale(1.05)',
      },
    },
  }),
};

export default CssBaseline;
