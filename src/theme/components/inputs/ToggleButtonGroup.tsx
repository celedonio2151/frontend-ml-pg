import type { Components, Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

/**
 * Grupo de opciones como "tarjetas" separadas (ícono + texto en columna), en
 * lugar de botones pegados. La disposición (grilla, columnas) va en cada uso.
 */
const ToggleButtonGroup: Components<Omit<Theme, 'components'>>['MuiToggleButtonGroup'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      gap: theme.spacing(1.5),
    }),
    grouped: ({ theme }) => ({
      // Anula el "pegado" por defecto (margen negativo y bordes/radios recortados).
      marginLeft: 0,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: Number(theme.shape.borderRadius) * 1.5,
      padding: theme.spacing(1.5),
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(0.5),
      textTransform: 'none',
      transition: theme.transitions.create(['border-color', 'background-color', 'color']),
      '&.Mui-selected': {
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        color: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
        },
      },
    }),
  },
};

export default ToggleButtonGroup;
