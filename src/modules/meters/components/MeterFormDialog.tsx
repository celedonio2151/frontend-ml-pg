import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// MUI ICONS
import SpeedRounded from '@mui/icons-material/SpeedRounded';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';

// MUI CORE
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

import FormDialog from 'components/FormDialog';
import { useCreateMeterMutation, useUpdateMeterMutation } from 'modules/meters/hooks/useMeters';
import { meterFormSchema, type MeterFormValues } from 'modules/meters/schemas/meter.schemas';
import type { MeterWithUser } from 'modules/meters/types/meter.types';
import { useUsers } from 'modules/users/hooks/useUsers';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type MeterFormDialogProps = {
  meter?: MeterWithUser;
  onClose: () => void;
  open: boolean;
};

export default function MeterFormDialog({ meter, onClose, open }: MeterFormDialogProps) {
  const isEditing = Boolean(meter);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createMutation = useCreateMeterMutation();
  const updateMutation = useUpdateMeterMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const usersQuery = useUsers({ limit: 1000, sortBy: [{ whom: 'name', order: 'asc' }] });
  const users = usersQuery.data?.items ?? [];

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<MeterFormValues>({
    defaultValues: {
      meterNumber: '',
      maximumCapacity: '999999',
      userId: '',
      status: true,
    },
    mode: 'onBlur',
    resolver: zodResolver(meterFormSchema),
  });

  useEffect(() => {
    if (open) {
      setSubmitError(null);
      if (meter) {
        reset({
          meterNumber: String(meter.meterNumber),
          maximumCapacity: String(meter.maximumCapacity),
          userId: meter.userId,
          status: meter.status,
        });
      } else {
        reset({
          meterNumber: '',
          maximumCapacity: '999999',
          userId: '',
          status: true,
        });
      }
    } else {
      createMutation.reset();
      updateMutation.reset();
    }
  }, [meter, open, reset]);

  const handleClose = useCallback(() => {
    if (isPending) return;
    onClose();
  }, [isPending, onClose]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      if (isEditing && meter) {
        await updateMutation.mutateAsync({
          id: meter.id,
          payload: {
            meterNumber: Number(values.meterNumber),
            maximumCapacity: Number(values.maximumCapacity),
            status: values.status,
          },
        });
      } else {
        await createMutation.mutateAsync({
          meterNumber: Number(values.meterNumber),
          maximumCapacity: Number(values.maximumCapacity),
          userId: values.userId,
        });
      }
      handleClose();
    } catch (error) {
      if (!applyApiFieldErrors(error, setError)) {
        setSubmitError(getApiErrorMessage(error, 'Ocurrió un error al guardar el medidor'));
      }
    }
  });

  return (
    <FormDialog
      error={submitError}
      formId="meter-form"
      isSubmitting={isPending}
      maxWidth="sm"
      onClose={handleClose}
      onSubmit={onSubmit}
      open={open}
      title={isEditing ? 'Actualizar medidor' : 'Nuevo medidor'}
    >
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            error={Boolean(errors.meterNumber)}
            fullWidth
            helperText={errors.meterNumber?.message}
            label="Número de medidor"
            size="medium"
            type="number"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SpeedRounded fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            {...register('meterNumber')}
          />

          <TextField
            error={Boolean(errors.maximumCapacity)}
            fullWidth
            helperText={errors.maximumCapacity?.message}
            label="Capacidad máxima"
            size="medium"
            type="number"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SettingsRounded fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            {...register('maximumCapacity')}
          />
        </Stack>

        {!isEditing && (
          <TextField
            error={Boolean(errors.userId)}
            fullWidth
            helperText={
              errors.userId?.message ||
              (usersQuery.isError ? 'No se pudieron cargar usuarios' : undefined)
            }
            label="Propietario"
            select
            size="medium"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRounded fontSize="small" />
                  </InputAdornment>
                ),
              },
              htmlInput: { 'aria-label': 'Seleccionar propietario' },
            }}
            {...register('userId')}
          >
            <MenuItem disabled value="">
              <em>Seleccione un propietario</em>
            </MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name} {user.surname} (CI: {user.ci})
              </MenuItem>
            ))}
          </TextField>
        )}

        {isEditing && (
          <Controller
            control={control}
            name="status"
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                control={<Switch checked={value} onChange={onChange} color="primary" />}
                label={value ? 'Medidor Activo' : 'Medidor Inactivo'}
              />
            )}
          />
        )}
      </Stack>
    </FormDialog>
  );
}
