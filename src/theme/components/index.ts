import type { Components, Theme } from '@mui/material/styles';

import Button from './buttons/Button';
import Chip from './data-display/Chip';
import Alert from './feedback/Alert';
import Dialog from './feedback/Dialog';
import OutlinedInput from './inputs/OutlinedInput';
import TextField from './inputs/TextField';
import ToggleButtonGroup from './inputs/ToggleButtonGroup';
import CssBaseline from './layouts/CssBaseline';
import { DatePicker, DateTimePicker } from './pickers/DatePicker';
import LinearProgress from './progress/LinearProgress';
import Paper from './surfaces/Paper';

export const components: Components<Omit<Theme, 'components'>> = {
  MuiAlert: Alert,
  MuiButton: Button,
  MuiChip: Chip,
  MuiCssBaseline: CssBaseline,
  MuiDatePicker: DatePicker,
  MuiDateTimePicker: DateTimePicker,
  MuiDialog: Dialog,
  MuiLinearProgress: LinearProgress,
  MuiOutlinedInput: OutlinedInput,
  MuiPaper: Paper,
  MuiTextField: TextField,
  MuiToggleButtonGroup: ToggleButtonGroup,
};
