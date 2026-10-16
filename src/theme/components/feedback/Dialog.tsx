import type { Components, Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

/** Mismo redondeo que FormDialog y un desenfoque suave del fondo en todos los diálogos. */
const Dialog: Components<Omit<Theme, 'components'>>['MuiDialog'] = {
  styleOverrides: {
    paper: ({ theme }) => ({
      borderRadius: Number(theme.shape.borderRadius) * 3,
    }),
    paperFullScreen: {
      borderRadius: 0,
    },
  },
  defaultProps: {
    slotProps: {
      backdrop: {
        sx: (theme: Theme) => ({
          backdropFilter: 'blur(3px)',
          backgroundColor: alpha(
            theme.palette.common.black,
            theme.palette.mode === 'dark' ? 0.55 : 0.35,
          ),
        }),
      },
    },
  },
};

export default Dialog;
