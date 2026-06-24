import type { Components, Theme } from '@mui/material/styles';

const Button: Components<Omit<Theme, 'components'>>['MuiButton'] = {
  defaultProps: {
    disableElevation: true,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.shape.borderRadius,
      fontWeight: 600,
      textTransform: 'none',
    }),
  },
};

export default Button;
