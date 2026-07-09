import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';

type ConfirmDialogProps = {
  cancelLabel?: string;
  confirmColor?: 'error' | 'inherit' | 'primary' | 'secondary' | 'success' | 'warning';
  confirmLabel?: string;
  disableClose?: boolean;
  error?: ReactNode;
  isLoading?: boolean;
  loadingLabel?: string;
  message: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
};

const dialogPaperSx: SxProps<Theme> = {
  borderRadius: 3,
  overflow: 'hidden',
  background: (theme) =>
    theme.palette.mode === 'dark' ? 'rgba(14, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.94)',
  border: (theme) =>
    `1px solid ${theme.palette.mode === 'dark' ? 'rgba(125, 211, 252, 0.16)' : 'rgba(2, 132, 199, 0.20)'}`,
  boxShadow: (theme) =>
    theme.palette.mode === 'dark'
      ? '0 24px 70px rgba(0, 0, 0, 0.34)'
      : '0 24px 70px rgba(3, 105, 161, 0.16)',
  backdropFilter: 'blur(24px)',
};

const ConfirmDialog = ({
  cancelLabel = 'Cancelar',
  confirmColor = 'error',
  confirmLabel = 'Eliminar',
  disableClose = false,
  error,
  isLoading = false,
  loadingLabel = 'Procesando...',
  message,
  onClose,
  onConfirm,
  open,
  title,
}: ConfirmDialogProps) => {
  const handleClose = () => {
    if (!disableClose && !isLoading) {
      onClose();
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={handleClose}
      open={open}
      slotProps={{ paper: { sx: dialogPaperSx } }}
    >
      <DialogTitle sx={{ fontWeight: 900, px: 3, pt: 2.5, pb: 1.5 }}>{title}</DialogTitle>
      <DialogContent sx={{ px: 3 }}>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button disabled={disableClose || isLoading} onClick={handleClose}>
          {cancelLabel}
        </Button>
        <Button color={confirmColor} disabled={isLoading} onClick={onConfirm} variant="contained">
          {isLoading ? loadingLabel : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
