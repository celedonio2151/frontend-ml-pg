import type { Components, Theme } from '@mui/material/styles';

const Paper: Components<Omit<Theme, 'components'>>['MuiPaper'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundImage: 'none',
      borderColor: theme.palette.divider,
      boxShadow: theme.shadows[5],
    }),
  },
};

export default Paper;
