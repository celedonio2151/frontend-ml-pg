import type { LinearProgressProps } from '@mui/material/LinearProgress';
import type { Components, Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

/** Colores de paleta que acepta `LinearProgress` (se derivan del tipo de MUI). */
type PaletteColorKey = Exclude<LinearProgressProps['color'], 'inherit' | undefined>;

/** Color de la paleta según la prop `color` (por defecto primary; `inherit` usa el color de texto). */
const getMainColor = (theme: Omit<Theme, 'components'>, color?: string) =>
  color === 'inherit'
    ? 'currentColor'
    : theme.palette[(color ?? 'primary') as PaletteColorKey].main;

/**
 * Barra de progreso con estilo de la app: delgada, redondeada, pista translúcida
 * del mismo color y barra con degradado. Se usa solo con props:
 *   <LinearProgress variant="determinate" color="warning" value={80} />
 */
const LinearProgress: Components<Omit<Theme, 'components'>>['MuiLinearProgress'] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => {
      const main = getMainColor(theme, ownerState.color);
      return {
        height: 6,
        borderRadius: 999,
        backgroundColor:
          main === 'currentColor'
            ? alpha(theme.palette.text.primary, 0.12)
            : alpha(main, theme.palette.mode === 'dark' ? 0.18 : 0.14),
      };
    },
    bar: ({ theme, ownerState }) => {
      const main = getMainColor(theme, ownerState.color);
      return {
        borderRadius: 999,
        ...(main !== 'currentColor' && {
          background: `linear-gradient(90deg, ${alpha(main, 0.85)}, ${main})`,
        }),
      };
    },
  },
};

export default LinearProgress;
