import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import FormDialog from 'components/FormDialog';
import { useChangeMeterOwnerMutation } from 'modules/meters/hooks/useMeters';
import { changeOwnerSchema, type ChangeOwnerValues } from 'modules/meters/schemas/meter.schemas';
import type { MeterWithUser } from 'modules/meters/types/meter.types';
import UserAutocomplete from 'modules/users/components/UserAutocomplete';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type ChangeOwnerDialogProps = {
  meter: MeterWithUser | null;
  onClose: () => void;
  open: boolean;
};

export default function ChangeOwnerDialog({ meter, onClose, open }: ChangeOwnerDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const changeOwnerMutation = useChangeMeterOwnerMutation();

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setError,
  } = useForm<ChangeOwnerValues>({
    defaultValues: { newUserId: '' },
    mode: 'onBlur',
    resolver: zodResolver(changeOwnerSchema),
  });

  useEffect(() => {
    if (open && meter) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubmitError(null);
      reset({ newUserId: '' });
    } else if (!open) {
      reset({ newUserId: '' });
      changeOwnerMutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meter, open, reset]);

  const handleClose = useCallback(() => {
    if (changeOwnerMutation.isPending) return;
    onClose();
  }, [changeOwnerMutation.isPending, onClose]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    if (!meter?.id) return;

    try {
      await changeOwnerMutation.mutateAsync({
        id: meter.id,
        payload: { newUserId: values.newUserId },
      });
      handleClose();
    } catch (error) {
      if (!applyApiFieldErrors(error, setError)) {
        setSubmitError(getApiErrorMessage(error, 'No se pudo cambiar el propietario'));
      }
    }
  });

  return (
    <FormDialog
      error={submitError}
      formId="change-owner-form"
      isSubmitting={changeOwnerMutation.isPending}
      maxWidth="sm"
      onClose={handleClose}
      onSubmit={onSubmit}
      open={open}
      title="Cambiar propietario"
    >
      <Stack spacing={3}>
        <Typography variant="body2" color="text.secondary">
          Seleccione el nuevo propietario para el medidor <strong>#{meter?.meterNumber}</strong>.
          Actualmente pertenece a {meter?.user?.name} {meter?.user?.surname}.
        </Typography>

        <Controller
          control={control}
          name="newUserId"
          render={({ field }) => (
            <UserAutocomplete
              error={Boolean(errors.newUserId)}
              excludeUserId={meter?.userId}
              helperText={errors.newUserId?.message}
              label="Nuevo propietario"
              onBlur={field.onBlur}
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
      </Stack>
    </FormDialog>
  );
}
