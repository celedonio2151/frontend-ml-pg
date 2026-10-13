import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import FormDialog from 'components/FormDialog';
import {
  useCreateBoardDirectorMutation,
  useUpdateBoardDirectorMutation,
} from 'modules/directiva/hooks/useDirectiva';
import {
  boardDirectorSchema,
  type BoardDirectorFormValues,
} from 'modules/directiva/schemas/directiva.schemas';
import type { BoardDirector } from 'modules/directiva/types/directiva.types';
import { useUsers } from 'modules/users/hooks/useUsers';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type DirectivaFormDialogProps = {
  boardDirector: BoardDirector | null;
  onClose: () => void;
  open: boolean;
};

const emptyValues: BoardDirectorFormValues = {
  startDate: '',
  endDate: '',
  positionRole: '',
  order: 1,
  description: '',
  status: true,
  userId: '',
};

export default function DirectivaFormDialog({
  boardDirector,
  onClose,
  open,
}: DirectivaFormDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = Boolean(boardDirector);

  const createMutation = useCreateBoardDirectorMutation();
  const updateMutation = useUpdateBoardDirectorMutation();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const usersQuery = useUsers({ limit: 1000, sortBy: [{ whom: 'name', order: 'asc' }] });
  const users = usersQuery.data?.items ?? [];

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<BoardDirectorFormValues>({
    defaultValues: emptyValues,
    mode: 'onBlur',
    resolver: zodResolver(boardDirectorSchema),
  });

  useEffect(() => {
    if (open && boardDirector) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubmitError(null);
      reset({
        startDate: boardDirector.startDate.slice(0, 10),
        endDate: boardDirector.endDate.slice(0, 10),
        positionRole: boardDirector.positionRole,
        order: boardDirector.order,
        description: boardDirector.description ?? '',
        status: boardDirector.status,
        userId: boardDirector.userId,
      });
    } else if (open && !boardDirector) {
      setSubmitError(null);
      reset(emptyValues);
    }
  }, [boardDirector, open, reset]);

  const handleClose = useCallback(() => {
    if (isSaving) return;
    onClose();
  }, [isSaving, onClose]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    const payload = {
      startDate: values.startDate,
      endDate: values.endDate,
      positionRole: values.positionRole.trim(),
      order: values.order,
      description: values.description?.trim() || undefined,
      status: values.status,
      userId: values.userId,
    };

    try {
      if (isEditing && boardDirector) {
        await updateMutation.mutateAsync({ id: boardDirector.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      handleClose();
    } catch (error) {
      if (!applyApiFieldErrors(error, setError)) {
        setSubmitError(getApiErrorMessage(error, 'No se pudo guardar la designación'));
      }
    }
  });

  return (
    <FormDialog
      error={submitError}
      formId="directiva-form"
      isSubmitting={isSaving}
      maxWidth="sm"
      onClose={handleClose}
      onSubmit={onSubmit}
      open={open}
      title={isEditing ? 'Editar designación' : 'Nueva designación'}
      submitLabel={isEditing ? 'Guardar cambios' : 'Crear designación'}
      submittingLabel="Guardando..."
    >
      <Stack spacing={2.5}>
        <Controller
          control={control}
          name="userId"
          render={({ field }) => (
            <Autocomplete
              options={users}
              value={users.find((u) => u.id === field.value) ?? null}
              onChange={(_, user) => field.onChange(user?.id ?? '')}
              getOptionLabel={(user) => `${user.name} ${user.surname} CI: ${user.ci}`}
              renderOption={(props, user) => {
                const { key, ...optionProps } = props;
                return (
                  <Box key={key} component="li" {...optionProps}>
                    <Avatar
                      alt={`${user.name} ${user.surname}`}
                      src={user.profileImg}
                      sx={{ width: 36, height: 36, mr: 1.5 }}
                    />
                    <Stack spacing={0.25}>
                      <span>
                        {user.name} {user.surname}
                      </span>
                    </Stack>
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Usuario"
                  error={Boolean(errors.userId)}
                  helperText={errors.userId?.message}
                />
              )}
            />
          )}
        />

        <TextField
          {...register('positionRole')}
          error={Boolean(errors.positionRole)}
          fullWidth
          helperText={errors.positionRole?.message}
          label="Cargo"
          placeholder="Ej: Presidente, Secretario, Tesorero..."
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <DatePicker
                label="Fecha de inicio"
                onChange={(value) => field.onChange(value?.isValid() ? value.format('YYYY-MM-DD') : '')}
                value={field.value ? dayjs(field.value) : null}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: Boolean(errors.startDate),
                    helperText: errors.startDate?.message,
                  },
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <DatePicker
                label="Fecha de fin"
                onChange={(value) => field.onChange(value?.isValid() ? value.format('YYYY-MM-DD') : '')}
                value={field.value ? dayjs(field.value) : null}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: Boolean(errors.endDate),
                    helperText: errors.endDate?.message,
                  },
                }}
              />
            )}
          />
        </Stack>

        <Controller
          control={control}
          name="order"
          render={({ field }) => (
            <TextField
              error={Boolean(errors.order)}
              fullWidth
              helperText={errors.order?.message || 'Orden jerárquico; 1 es el cargo más alto'}
              label="Orden jerárquico"
              onChange={(e) => field.onChange(Number(e.target.value))}
              type="number"
              value={field.value}
            />
          )}
        />

        <TextField
          {...register('description')}
          error={Boolean(errors.description)}
          fullWidth
          helperText={errors.description?.message}
          label="Descripción (opcional)"
          multiline
          minRows={2}
        />

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <FormControlLabel
              control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
              label="Designación habilitada"
            />
          )}
        />
      </Stack>
    </FormDialog>
  );
}
