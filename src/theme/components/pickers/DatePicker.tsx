import type { Components, Theme } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';

/** Los selectores de fecha ocupan todo el ancho de su contenedor salvo que se indique lo contrario. */
export const DatePicker: Components<Omit<Theme, 'components'>>['MuiDatePicker'] = {
  defaultProps: {
    slotProps: { textField: { fullWidth: true } },
  },
};

export const DateTimePicker: Components<Omit<Theme, 'components'>>['MuiDateTimePicker'] = {
  defaultProps: {
    slotProps: { textField: { fullWidth: true } },
  },
};
