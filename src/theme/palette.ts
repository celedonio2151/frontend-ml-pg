import type { PaletteMode, PaletteOptions } from '@mui/material/styles';
import { colors, semanticColors } from './colors';

export const createPaletteOptions = (mode: PaletteMode): PaletteOptions => {
  const colorMode = semanticColors[mode];

  return {
    mode,
    common: colors.common,
    grey: colors.neutral,
    primary: colorMode.primary,
    secondary: colorMode.secondary,
    error: colorMode.error,
    warning: colorMode.warning,
    info: colorMode.info,
    success: colorMode.success,
    background: colorMode.background,
    text: colorMode.text,
    action: colorMode.action,
    divider: colorMode.divider,
  };
};

export const lightPalette = createPaletteOptions('light');

export const darkPalette = createPaletteOptions('dark');
