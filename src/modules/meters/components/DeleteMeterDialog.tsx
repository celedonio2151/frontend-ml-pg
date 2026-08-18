import { useState } from 'react';

import ConfirmDialog from 'components/ConfirmDialog';
import { useDeleteMeterMutation } from 'modules/meters/hooks/useMeters';
import type { MeterWithUser } from 'modules/meters/types/meter.types';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type DeleteMeterDialogProps = {
  meter: MeterWithUser | null;
  onClose: () => void;
  open: boolean;
};

export default function DeleteMeterDialog({ meter, onClose, open }: DeleteMeterDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const deleteMutation = useDeleteMeterMutation();
  const isDeleting = deleteMutation.isPending;

  const handleClose = () => {
    if (!isDeleting) {
      setSubmitError(null);
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!meter?.id) return;

    setSubmitError(null);

    try {
      await deleteMutation.mutateAsync(meter.id);
      handleClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'No se pudo eliminar el medidor'));
    }
  };

  return (
    <ConfirmDialog
      confirmLabel="Eliminar"
      error={submitError}
      isLoading={isDeleting}
      loadingLabel="Eliminando..."
      message={`¿Estás seguro de que deseas eliminar el medidor de ${meter?.user?.name ?? ''} ${
        meter?.user?.surname ?? ''
      } (Número #${meter?.meterNumber ?? ''})? Esta acción no se puede deshacer.`}
      onClose={handleClose}
      onConfirm={() => void handleConfirm()}
      open={open}
      title="Eliminar medidor"
    />
  );
}
