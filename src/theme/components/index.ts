import type { Components, Theme } from '@mui/material/styles';
import Button from './buttons/Button';
import OutlinedInput from './inputs/OutlinedInput';
import TextField from './inputs/TextField';
import CssBaseline from './layouts/CssBaseline';
import Paper from './surfaces/Paper';

export const components: Components<Omit<Theme, 'components'>> = {
  MuiButton: Button,
  MuiCssBaseline: CssBaseline,
  MuiOutlinedInput: OutlinedInput,
  MuiPaper: Paper,
  MuiTextField: TextField,
};
