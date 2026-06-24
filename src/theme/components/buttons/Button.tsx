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
      minHeight: 40,
      transition: theme.transitions.create(['background-color', 'border-color', 'box-shadow', 'transform']),
      '&:hover': {
        transform: 'translateY(-1px)',
      },
    }),
  },
  variants: [
    {
      props: { color: 'primary', variant: 'contained' },
      style: {
        background: 'linear-gradient(135deg, #06b6d4, #0369a1)',
        color: '#ffffff',
        boxShadow: '0 14px 30px rgba(6, 182, 212, 0.18)',
        '&:hover': {
          boxShadow: '0 18px 36px rgba(6, 182, 212, 0.24)',
        },
      },
    },
    {
      props: { color: 'primary', variant: 'outlined' },
      style: {
        borderColor: 'rgba(34, 211, 238, 0.28)',
        color: '#0891b2',
        backgroundColor: 'rgba(6, 182, 212, 0.06)',
        '&:hover': {
          borderColor: 'rgba(34, 211, 238, 0.42)',
          backgroundColor: 'rgba(6, 182, 212, 0.12)',
        },
      },
    },
  ],
};

export default Button;
