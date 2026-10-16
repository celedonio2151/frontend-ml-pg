import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import FormDialog from 'components/FormDialog';
import { useUpdateMyProfileMutation } from 'modules/my-account/hooks/useMyAccount';
import type { MyProfile } from 'modules/my-account/types/my-account.types';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

const editMyProfileSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'El correo es requerido')
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: 'Correo invalido' }),
  phoneNumber: z.string().trim().optional(),
  birthDate: z.string().trim().optional(),
});

type EditMyProfileValues = z.infer<typeof editMyProfileSchema>;

type EditMyProfileDialogProps = {
  onClose: () => void;
  open: boolean;
  profile: MyProfile;
};

export default function EditMyProfileDialog({ onClose, open, profile }: EditMyProfileDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const updateMutation = useUpdateMyProfileMutation();

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<EditMyProfileValues>({
    defaultValues: { email: '', phoneNumber: '', birthDate: '' },
    mode: 'onBlur',
    resolver: zodResolver(editMyProfileSchema),
  });

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubmitError(null);
      reset({
        email: profile.email ?? '',
        phoneNumber: profile.phoneNumber ?? '',
        birthDate: profile.birthDate?.slice(0, 10) ?? '',
      });
    }
  }, [open, profile, reset]);

  const handleClose = () => {
    if (!updateMutation.isPending) onClose();
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await updateMutation.mutateAsync({
        email: values.email,
        phoneNumber: values.phoneNumber || undefined,
        birthDate: values.birthDate || undefined,
      });
      onClose();
    } catch (error) {
      if (!applyApiFieldErrors(error, setError)) {
        setSubmitError(getApiErrorMessage(error, 'No se pudo actualizar tu perfil'));
      }
    }
  });

  return (
    <FormDialog
      error={submitError}
      formId="edit-my-profile-form"
      isSubmitting={updateMutation.isPending}
      maxWidth="xs"
      onClose={handleClose}
      onSubmit={onSubmit}
      open={open}
      title="Editar mi perfil"
      submitLabel="Guardar"
    >
      <Stack spacing={2.5}>
        <TextField
          {...register('email')}
          error={Boolean(errors.email)}
          fullWidth
          helperText={errors.email?.message}
          label="Correo"
          type="email"
        />
        <TextField
          {...register('phoneNumber')}
          error={Boolean(errors.phoneNumber)}
          fullWidth
          helperText={errors.phoneNumber?.message}
          label="Teléfono"
        />
        <Controller
          control={control}
          name="birthDate"
          render={({ field }) => (
            <DatePicker
              label="Fecha de nacimiento"
              onChange={(value) =>
                field.onChange(value?.isValid() ? value.format('YYYY-MM-DD') : '')
              }
              value={field.value ? dayjs(field.value) : null}
              slotProps={{
                textField: {
                  error: Boolean(errors.birthDate),
                  helperText: errors.birthDate?.message,
                },
              }}
            />
          )}
        />
      </Stack>
    </FormDialog>
  );
}
