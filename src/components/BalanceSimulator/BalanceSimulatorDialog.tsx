import CalculateRounded from '@mui/icons-material/CalculateRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import BalanceSimulatorCard from 'components/BalanceSimulator/BalanceSimulatorCard';

type BalanceSimulatorDialogProps = {
  onClose: () => void;
  open: boolean;
};

/**
 * Simulador de saldo en un diálogo aparte: pensado para abrirse desde el
 * botón de un toolbar (p. ej. en Lecturas o Facturas) sin tocar ni ocupar
 * espacio en la tabla principal de esa pantalla.
 */
export default function BalanceSimulatorDialog({ onClose, open }: BalanceSimulatorDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
          <CalculateRounded color="primary" />
          <Typography variant="h6">Simular saldo</Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseRounded />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <BalanceSimulatorCard compact />
      </DialogContent>
    </Dialog>
  );
}
