import type { PaletteMode, ThemeOptions } from '@mui/material/styles';
import { components } from './components';
import { darkPalette, lightPalette } from './palette';
import { typography } from './typography';

export const sharedThemeOptions: ThemeOptions = {
  typography,
  shape: {
    borderRadius: 8,
  },
  components,
};

export const getThemeOptions = (mode: PaletteMode): ThemeOptions => ({
  palette: mode === 'dark' ? darkPalette : lightPalette,
  ...sharedThemeOptions,
});
