import type { Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

export type AquaTone = 'aqua' | 'success' | 'warning' | 'error' | 'neutral' | 'purple';

type ToneAccent = { dark: string; light: string };

const toneAccent: Record<AquaTone, ToneAccent> = {
  aqua: { dark: '#22d3ee', light: '#0891b2' },
  success: { dark: '#4ade80', light: '#15803d' },
  warning: { dark: '#facc15', light: '#b45309' },
  error: { dark: '#f87171', light: '#dc2626' },
  neutral: { dark: '#93a8bd', light: '#475569' },
  purple: { dark: '#c084fc', light: '#7c3aed' },
};

export type AquaToneToken = {
  accent: string;
  border: string;
  surface: string;
};

export const getAquaTone = (theme: Theme, tone: AquaTone): AquaToneToken => {
  const isDark = theme.palette.mode === 'dark';
  const accent = isDark ? toneAccent[tone].dark : toneAccent[tone].light;

  return {
    accent,
    border: alpha(accent, 0.28),
    surface: alpha(accent, isDark ? 0.12 : 0.1),
  };
};
