import { useState } from 'react';
import ConfirmDialog from 'components/ConfirmDialog';
import { useDeleteReadingMutation } from 'modules/readings/hooks/useReadings';
import type { ReadingWithMeterAndUser } from 'modules/readings/types/reading.types';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type DeleteReadingDialogProps = {
  onClose: () => void;
  open: boolean;
  reading?: ReadingWithMeterAndUser | null;
};

export default function DeleteReadingDialog({ onClose, open, reading }: DeleteReadingDialogProps) {
  const deleteReadingMutation = useDeleteReadingMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isDeleting = deleteReadingMutation.isPending;

  const handleClose = () => {
    if (!isDeleting) {
      setSubmitError(null);
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!reading) return;

    setSubmitError(null);

    try {
      await deleteReadingMutation.mutateAsync(reading.id);
      handleClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'No se pudo eliminar la lectura'));
    }
  };

  return (
    <ConfirmDialog
      confirmLabel="Eliminar"
      error={submitError}
      isLoading={isDeleting}
      loadingLabel="Eliminando..."
      message={`Esta accion eliminara la lectura del medidor ${reading?.meter?.meterNumber ?? reading?.meterId ?? ''}. Puedes cancelar si aun necesitas revisar la factura asociada.`}
      onClose={handleClose}
      onConfirm={() => void handleConfirm()}
      open={open}
      title="Eliminar lectura"
    />
  );
}
