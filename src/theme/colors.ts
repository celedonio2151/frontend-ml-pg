import type { PaletteOptions } from '@mui/material/styles';

type ColorModeTokens = {
  action: NonNullable<PaletteOptions['action']>;
  background: NonNullable<PaletteOptions['background']>;
  divider: string;
  error: NonNullable<PaletteOptions['error']>;
  info: NonNullable<PaletteOptions['info']>;
  primary: NonNullable<PaletteOptions['primary']>;
  secondary: NonNullable<PaletteOptions['secondary']>;
  success: NonNullable<PaletteOptions['success']>;
  text: NonNullable<PaletteOptions['text']>;
  warning: NonNullable<PaletteOptions['warning']>;
};

export const colors = {
  common: {
    black: '#050607',
    white: '#ffffff',
  },
  deep: {
    900: '#0a1628',
    950: '#060d18',
  },
  ocean: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  aqua: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
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
} as const;

export const semanticColors: Record<'light' | 'dark', ColorModeTokens> = {
  light: {
    primary: {
      main: colors.aqua[600],
      light: colors.aqua[400],
      dark: colors.ocean[800],
      contrastText: colors.common.white,
    },
    secondary: {
      main: colors.ocean[500],
      light: colors.ocean[300],
      dark: colors.ocean[700],
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
      main: colors.ocean[500],
      light: colors.ocean[300],
      dark: colors.ocean[700],
      contrastText: colors.common.white,
    },
    success: {
      main: colors.green[500],
      light: colors.green[300],
      dark: colors.green[700],
      contrastText: colors.common.white,
    },
    background: {
      default: colors.ocean[50],
      paper: 'rgba(255, 255, 255, 0.82)',
    },
    text: {
      primary: colors.deep[950],
      secondary: colors.ocean[800],
      disabled: colors.neutral[400],
    },
    action: {
      active: colors.ocean[800],
      hover: 'rgba(6, 182, 212, 0.08)',
      selected: 'rgba(6, 182, 212, 0.14)',
      disabled: 'rgba(15, 23, 42, 0.38)',
      disabledBackground: 'rgba(15, 23, 42, 0.12)',
      focus: 'rgba(6, 182, 212, 0.18)',
    },
    divider: 'rgba(3, 105, 161, 0.14)',
  },
  dark: {
    primary: {
      main: colors.aqua[400],
      light: colors.aqua[300],
      dark: colors.aqua[600],
      contrastText: colors.deep[950],
    },
    secondary: {
      main: colors.ocean[400],
      light: colors.ocean[300],
      dark: colors.ocean[700],
      contrastText: colors.deep[950],
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
      main: colors.ocean[300],
      light: colors.ocean[50],
      dark: colors.ocean[500],
      contrastText: colors.neutral[900],
    },
    success: {
      main: colors.green[300],
      light: colors.green[50],
      dark: colors.green[500],
      contrastText: colors.neutral[900],
    },
    background: {
      default: colors.deep[950],
      paper: 'rgba(14, 23, 42, 0.72)',
    },
    text: {
      primary: '#f8fbff',
      secondary: '#8fb5cb',
      disabled: colors.neutral[600],
    },
    action: {
      active: colors.aqua[100],
      hover: 'rgba(34, 211, 238, 0.10)',
      selected: 'rgba(34, 211, 238, 0.18)',
      disabled: 'rgba(248, 250, 252, 0.38)',
      disabledBackground: 'rgba(248, 250, 252, 0.12)',
      focus: 'rgba(34, 211, 238, 0.24)',
    },
    divider: 'rgba(125, 211, 252, 0.14)',
  },
} satisfies Record<'light' | 'dark', ColorModeTokens>;
