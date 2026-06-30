import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useDeleteUserMutation } from 'modules/users/hooks/useUsers';
import type { User } from 'modules/users/types/user.types';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type DeleteUserDialogProps = {
  onClose: () => void;
  open: boolean;
  user?: User | null;
};

export default function DeleteUserDialog({ onClose, open, user }: DeleteUserDialogProps) {
  const deleteUserMutation = useDeleteUserMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isDeleting = deleteUserMutation.isPending;

  const handleClose = () => {
    if (!isDeleting) {
      setSubmitError(null);
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!user) {
      return;
    }

    setSubmitError(null);

    try {
      await deleteUserMutation.mutateAsync(user.id);
      handleClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'No se pudo eliminar el usuario'));
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" onClose={handleClose} open={open}>
      <DialogTitle sx={{ fontWeight: 900 }}>Eliminar usuario</DialogTitle>
      <DialogContent>
        {submitError ? <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert> : null}
        <DialogContentText>
          Esta accion eliminara a {user?.name} {user?.surname}. Puedes cancelar si aun necesitas revisar
          sus medidores o facturas.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button disabled={isDeleting} onClick={handleClose}>
          Cancelar
        </Button>
        <Button color="error" disabled={isDeleting} onClick={handleConfirm} variant="contained">
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

