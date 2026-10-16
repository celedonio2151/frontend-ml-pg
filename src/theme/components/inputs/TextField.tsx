import type { Components, Theme } from '@mui/material/styles';

const TextField: Components<Omit<Theme, 'components'>>['MuiTextField'] = {
  defaultProps: {
    variant: 'outlined',
    // Formularios en tamaño medio; buscadores/filtros compactos pasan size="small" explícito.
    size: 'medium',
  },
};

export default TextField;
