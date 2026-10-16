import type { Components, Theme } from '@mui/material/styles';

const Alert: Components<Omit<Theme, 'components'>>['MuiAlert'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: Number(theme.shape.borderRadius) * 1.5,
    }),
  },
};

export default Alert;
