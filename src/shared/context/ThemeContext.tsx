import { useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { getThemeOptions } from 'shared/theme';
import { useUIStore } from 'shared/stores/ui.store';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeMode = useUIStore((s) => s.themeMode);

  const theme = useMemo(() => createTheme(getThemeOptions(themeMode)), [themeMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
