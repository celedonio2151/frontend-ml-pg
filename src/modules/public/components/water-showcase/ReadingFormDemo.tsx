import { useState, type SyntheticEvent } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slider from '@mui/material/Slider';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseRounded from '@mui/icons-material/CloseRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import dayjs from 'dayjs';
import AquaPanel from 'shared/ui/aqua/AquaPanel';

function ReadingFormDemo() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSaveDemo = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <>
      <AquaPanel liquid>
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Registro de lectura
          </Typography>
          <Box component="form">
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField fullWidth label="Medidor" defaultValue="#1001" />
                <DatePicker
                  label="Fecha de lectura"
                  defaultValue={dayjs('2026-06-24')}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField fullWidth label="Lectura anterior" defaultValue="44,980" />
                <TextField fullWidth label="Lectura actual" defaultValue="45,230" />
              </Stack>
              <TextField select fullWidth label="Estado de facturacion" defaultValue="pending">
                <MenuItem value="paid">Pagado</MenuItem>
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="overdue">Vencido</MenuItem>
              </TextField>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' } }}>
                <FormControlLabel control={<Switch defaultChecked />} label="Notificar al usuario" />
                <FormControlLabel control={<Checkbox defaultChecked />} label="Generar QR" />
              </Stack>
              <FormControl>
                <FormLabel>Metodo preferido</FormLabel>
                <RadioGroup row defaultValue="qr">
                  <FormControlLabel value="qr" control={<Radio />} label="QR BNB" />
                  <FormControlLabel value="transfer" control={<Radio />} label="Transferencia" />
                </RadioGroup>
              </FormControl>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Consumo estimado
                </Typography>
                <Slider defaultValue={62} valueLabelDisplay="auto" />
              </Box>
              <Stack direction="row" spacing={1.5}>
                <Button variant="contained" startIcon={<SaveRounded />} onClick={handleSaveDemo}>
                  Guardar demo
                </Button>
                <Button variant="outlined" startIcon={<CloseRounded />} onClick={() => setDialogOpen(true)}>
                  Cancelar
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </AquaPanel>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Cancelar cambios</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Este dialogo demuestra el componente modal personalizado para acciones sensibles del panel.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Volver</Button>
          <Button color="error" variant="contained" onClick={() => setDialogOpen(false)}>
            Descartar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3200}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" variant="filled">
          Demo guardada. El componente de snackbar esta listo.
        </Alert>
      </Snackbar>
    </>
  );
}

export default ReadingFormDemo;
