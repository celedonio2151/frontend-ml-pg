import { useMemo, type ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { useUIStore } from 'shared/stores/ui.store';
import { getThemeOptions } from 'theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const themeMode = useUIStore((s) => s.themeMode);

  const theme = useMemo(() => createTheme(getThemeOptions(themeMode)), [themeMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
