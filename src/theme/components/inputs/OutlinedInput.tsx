import type { Components, Theme } from '@mui/material/styles';

const OutlinedInput: Components<Omit<Theme, 'components'>>['MuiOutlinedInput'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(8, 47, 73, 0.28)' : 'rgba(255, 255, 255, 0.74)',
      color: theme.palette.text.primary,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.mode === 'dark' ? 'rgba(125, 211, 252, 0.18)' : 'rgba(2, 132, 199, 0.18)',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.mode === 'dark' ? 'rgba(34, 211, 238, 0.38)' : 'rgba(2, 132, 199, 0.34)',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        boxShadow: '0 0 0 3px rgba(34, 211, 238, 0.10)',
      },
    }),
  },
};

export default OutlinedInput;
