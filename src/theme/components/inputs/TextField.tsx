import type { Components, Theme } from '@mui/material/styles';

const TextField: Components<Omit<Theme, 'components'>>['MuiTextField'] = {
  defaultProps: {
    variant: 'outlined',
  },
};

export default TextField;
