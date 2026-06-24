import type { PaletteOptions } from '@mui/material/styles';

type ColorModeTokens = {
  primary: NonNullable<PaletteOptions['primary']>;
  secondary: NonNullable<PaletteOptions['secondary']>;
  error: NonNullable<PaletteOptions['error']>;
  warning: NonNullable<PaletteOptions['warning']>;
  info: NonNullable<PaletteOptions['info']>;
  success: NonNullable<PaletteOptions['success']>;
  background: NonNullable<PaletteOptions['background']>;
  text: NonNullable<PaletteOptions['text']>;
  action: NonNullable<PaletteOptions['action']>;
  divider: string;
};

export const colors = {
  common: {
    black: '#050607',
    white: '#ffffff',
  },
  coffee: {
    50: '#f8f1ec',
    100: '#ead8cc',
    200: '#d9baa4',
    300: '#c69b7b',
    400: '#a67b5b',
    500: '#8d6e63',
    600: '#6f4e37',
    700: '#5d4037',
    800: '#4e342e',
    900: '#3e2723',
  },
  caramel: {
    50: '#fff8ef',
    100: '#f9ead8',
    200: '#efd3af',
    300: '#e8c9a5',
    400: '#d4a574',
    500: '#b08968',
    600: '#9a7456',
    700: '#7d5b43',
    800: '#5f4434',
    900: '#3f2d24',
  },
  neutral: {
    50: '#f8f9fa',
    100: '#f1f3f5',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#868e96',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
  },
  red: {
    50: '#fff1f2',
    300: '#fda4af',
    500: '#e11d48',
    700: '#be123c',
  },
  amber: {
    50: '#fffbeb',
    300: '#fcd34d',
    500: '#f59e0b',
    700: '#b45309',
  },
  green: {
    50: '#ecfdf5',
    300: '#6ee7b7',
    500: '#10b981',
    700: '#047857',
  },
  cyan: {
    50: '#ecfeff',
    300: '#67e8f9',
    500: '#06b6d4',
    700: '#0e7490',
  },
} as const;

export const semanticColors: Record<'light' | 'dark', ColorModeTokens> = {
  light: {
    primary: {
      main: colors.coffee[600],
      light: colors.coffee[500],
      dark: colors.coffee[800],
      contrastText: colors.common.white,
    },
    secondary: {
      main: colors.coffee[400],
      light: colors.coffee[300],
      dark: colors.coffee[700],
      contrastText: colors.common.white,
    },
    error: {
      main: colors.red[500],
      light: colors.red[300],
      dark: colors.red[700],
      contrastText: colors.common.white,
    },
    warning: {
      main: colors.amber[500],
      light: colors.amber[300],
      dark: colors.amber[700],
      contrastText: colors.neutral[900],
    },
    info: {
      main: colors.cyan[500],
      light: colors.cyan[300],
      dark: colors.cyan[700],
      contrastText: colors.common.white,
    },
    success: {
      main: colors.green[500],
      light: colors.green[300],
      dark: colors.green[700],
      contrastText: colors.common.white,
    },
    background: {
      default: '#f5f5f5',
      paper: colors.common.white,
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: colors.neutral[500],
    },
    action: {
      active: colors.neutral[700],
      hover: 'rgba(111, 78, 55, 0.08)',
      selected: 'rgba(111, 78, 55, 0.14)',
      disabled: 'rgba(33, 37, 41, 0.38)',
      disabledBackground: 'rgba(33, 37, 41, 0.12)',
      focus: 'rgba(111, 78, 55, 0.18)',
    },
    divider: 'rgba(33, 37, 41, 0.12)',
  },
  dark: {
    primary: {
      main: colors.caramel[400],
      light: colors.caramel[300],
      dark: colors.caramel[500],
      contrastText: colors.neutral[900],
    },
    secondary: {
      main: colors.coffee[500],
      light: colors.coffee[300],
      dark: colors.coffee[700],
      contrastText: colors.neutral[900],
    },
    error: {
      main: colors.red[300],
      light: colors.red[50],
      dark: colors.red[500],
      contrastText: colors.neutral[900],
    },
    warning: {
      main: colors.amber[300],
      light: colors.amber[50],
      dark: colors.amber[500],
      contrastText: colors.neutral[900],
    },
    info: {
      main: colors.cyan[300],
      light: colors.cyan[50],
      dark: colors.cyan[500],
      contrastText: colors.neutral[900],
    },
    success: {
      main: colors.green[300],
      light: colors.green[50],
      dark: colors.green[500],
      contrastText: colors.neutral[900],
    },
    background: {
      default: '#0f0f0f',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#e8e8e8',
      secondary: '#b8b8b8',
      disabled: colors.neutral[600],
    },
    action: {
      active: colors.neutral[200],
      hover: 'rgba(212, 165, 116, 0.10)',
      selected: 'rgba(212, 165, 116, 0.18)',
      disabled: 'rgba(248, 249, 250, 0.38)',
      disabledBackground: 'rgba(248, 249, 250, 0.12)',
      focus: 'rgba(212, 165, 116, 0.24)',
    },
    divider: 'rgba(248, 249, 250, 0.14)',
  },
} satisfies Record<'light' | 'dark', ColorModeTokens>;
