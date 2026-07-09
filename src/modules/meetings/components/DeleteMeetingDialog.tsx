import { useState } from 'react';
import ConfirmDialog from 'components/ConfirmDialog';
import { useDeleteMeetingMutation } from 'modules/meetings/hooks/useMeetings';
import type { Meeting } from 'modules/meetings/types/meeting.types';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type DeleteMeetingDialogProps = {
  meeting?: Meeting | null;
  onClose: () => void;
  open: boolean;
};

export default function DeleteMeetingDialog({ meeting, onClose, open }: DeleteMeetingDialogProps) {
  const deleteMeetingMutation = useDeleteMeetingMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isDeleting = deleteMeetingMutation.isPending;

  const handleClose = () => {
    if (!isDeleting) {
      setSubmitError(null);
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!meeting) return;

    setSubmitError(null);

    try {
      await deleteMeetingMutation.mutateAsync(meeting.id);
      handleClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'No se pudo eliminar la reunion'));
    }
  };

  return (
    <ConfirmDialog
      confirmLabel="Eliminar"
      error={submitError}
      isLoading={isDeleting}
      loadingLabel="Eliminando..."
      message={`Esta accion eliminara la reunion ${meeting?.title ?? ''}. Puedes cancelar si aun necesitas revisar el acta o los asistentes.`}
      onClose={handleClose}
      onConfirm={() => void handleConfirm()}
      open={open}
      title="Eliminar reunion"
    />
  );
}
