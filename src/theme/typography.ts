import type { TypographyVariantsOptions } from '@mui/material/styles';

export const typography: TypographyVariantsOptions = {
  fontFamily: 'Roboto, sans-serif',
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  button: {
    fontWeight: 600,
    textTransform: 'none',
  },
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    '@media (max-width:600px)': {
      fontSize: '2rem',
    },
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 700,
    '@media (max-width:600px)': {
      fontSize: '1.75rem',
    },
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    '@media (max-width:600px)': {
      fontSize: '1.5rem',
    },
  },
  h4: {
    lineHeight: 1.2,
    fontSize: '1.5rem',
    '@media (max-width:600px)': {
      fontSize: '1.25rem',
    },
  },
  h5: {
    lineHeight: 1.2,
    fontSize: '1.25rem',
    '@media (max-width:600px)': {
      fontSize: '1.1rem',
    },
  },
  h6: {
    lineHeight: 1.2,
    fontSize: '1.1rem',
    '@media (max-width:600px)': {
      fontSize: '1rem',
    },
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    '@media (max-width:600px)': {
      fontSize: '0.9rem',
    },
  },
  body1: {
    fontSize: '1rem',
    '@media (max-width:600px)': {
      fontSize: '0.9rem',
    },
  },
  body2: {
    fontSize: '0.875rem',
    '@media (max-width:600px)': {
      fontSize: '0.8rem',
    },
  },
};
