import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useDeleteBoardDirectorMutation } from 'modules/directiva/hooks/useDirectiva';
import type { BoardDirector } from 'modules/directiva/types/directiva.types';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type DeleteDirectivaDialogProps = {
  boardDirector?: BoardDirector | null;
  onClose: () => void;
  open: boolean;
};

export default function DeleteDirectivaDialog({
  boardDirector,
  onClose,
  open,
}: DeleteDirectivaDialogProps) {
  const deleteMutation = useDeleteBoardDirectorMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isDeleting = deleteMutation.isPending;

  const handleClose = () => {
    if (!isDeleting) {
      setSubmitError(null);
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!boardDirector) return;

    setSubmitError(null);

    try {
      await deleteMutation.mutateAsync(boardDirector.id);
      handleClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'No se pudo eliminar la designación'));
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" onClose={handleClose} open={open}>
      <DialogTitle sx={{ fontWeight: 900 }}>Eliminar designación</DialogTitle>
      <DialogContent>
        {submitError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        ) : null}
        <DialogContentText>
          Esta acción eliminará la designación de <strong>{boardDirector?.positionRole}</strong> para{' '}
          {boardDirector?.user.name} {boardDirector?.user.surname}.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button disabled={isDeleting} onClick={handleClose}>
          Cancelar
        </Button>
        <Button color="error" disabled={isDeleting} onClick={() => void handleConfirm()} variant="contained">
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
