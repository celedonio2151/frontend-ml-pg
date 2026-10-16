import type { Components, Theme } from '@mui/material/styles';

const Chip: Components<Omit<Theme, 'components'>>['MuiChip'] = {
  defaultProps: {
    size: 'small',
  },
};

export default Chip;
