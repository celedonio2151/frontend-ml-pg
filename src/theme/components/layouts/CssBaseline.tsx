import type { Components, Theme } from '@mui/material/styles';

const CssBaseline: Components<Omit<Theme, 'components'>>['MuiCssBaseline'] = {
  styleOverrides: {
    html: {
      minHeight: '100%',
    },
    body: {
      minHeight: '100%',
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    '#root': {
      minHeight: '100vh',
    },
  },
};

export default CssBaseline;
