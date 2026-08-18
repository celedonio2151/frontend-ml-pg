import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import FormDialog from 'components/FormDialog';
import { useChangeMeterOwnerMutation } from 'modules/meters/hooks/useMeters';
import { changeOwnerSchema, type ChangeOwnerValues } from 'modules/meters/schemas/meter.schemas';
import type { MeterWithUser } from 'modules/meters/types/meter.types';
import { useUsers } from 'modules/users/hooks/useUsers';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type ChangeOwnerDialogProps = {
  meter: MeterWithUser | null;
  onClose: () => void;
  open: boolean;
};

export default function ChangeOwnerDialog({ meter, onClose, open }: ChangeOwnerDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const changeOwnerMutation = useChangeMeterOwnerMutation();

  const usersQuery = useUsers({ limit: 1000, sortBy: [{ whom: 'name', order: 'asc' }] });
  const users = usersQuery.data?.items ?? [];

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
      setSubmitError(null);
      reset({ newUserId: meter.userId });
    } else if (!open) {
      reset({ newUserId: '' });
      changeOwnerMutation.reset();
    }
  }, [meter, open, reset]);

  const handleClose = useCallback(() => {
    if (changeOwnerMutation.isPending) return;
    onClose();
  }, [changeOwnerMutation.isPending, onClose]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    if (!meter?.id) return;

    if (values.newUserId === meter.userId) {
      onClose();
      return;
    }

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
            <Autocomplete
              options={users}
              value={users.find((u) => u.id === field.value) ?? null}
              onChange={(_, user) => {
                field.onChange(user?.id ?? '');
              }}
              getOptionLabel={(user) => `${user.name} ${user.surname} CI: ${user.ci}`}
              renderOption={(props, user) => {
                const { key, ...optionProps } = props;
                return (
                  <Box
                    key={key}
                    component="li"
                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                    {...optionProps}
                  >
                    <Avatar
                      alt={`${user.name} ${user.surname}`}
                      src={user.profileImg}
                      sx={{
                        width: 42,
                        height: 42,
                        border: '1px solid rgba(34, 211, 238, 0.30)',
                        bgcolor: 'rgba(6, 182, 212, 0.16)',
                        color: 'primary.light',
                        fontWeight: 900,
                      }}
                    />
                    <Stack spacing={0.5} sx={{ ml: 1 }}>
                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                        {user.name} {user.surname}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        CI: {user.ci}
                      </Typography>
                    </Stack>
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="medium"
                  label="Seleccione un propietario"
                  error={!!errors.newUserId}
                  helperText={errors.newUserId?.message}
                />
              )}
            />
          )}
        />
      </Stack>
    </FormDialog>
  );
}
