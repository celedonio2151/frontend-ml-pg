import type { Components, Theme } from '@mui/material/styles';

const Paper: Components<Omit<Theme, 'components'>>['MuiPaper'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundImage: 'none',
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      backdropFilter: 'blur(22px)',
      boxShadow: theme.palette.mode === 'dark' ? '0 24px 70px rgba(0, 0, 0, 0.24)' : '0 24px 70px rgba(3, 105, 161, 0.12)',
    }),
  },
};

export default Paper;
