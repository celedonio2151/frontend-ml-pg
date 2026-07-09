import { zodResolver } from '@hookform/resolvers/zod';
import BadgeRounded from '@mui/icons-material/BadgeRounded';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import EmailRounded from '@mui/icons-material/EmailRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import PhoneRounded from '@mui/icons-material/PhoneRounded';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FormDialog from 'components/FormDialog';
import { useCreateUserMutation, useUpdateUserMutation } from 'modules/users/hooks/useUsers';
import {
  createUserSchema,
  type UserFormValues,
} from 'modules/users/schemas/user.schemas';
import type { CreateUserDto, UpdateUserDto, User } from 'modules/users/types/user.types';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type UserFormDialogProps = {
  onClose: () => void;
  open: boolean;
  user?: User | null;
};

const emptyValues: UserFormValues = {
  birthDate: '',
  ci: '',
  email: '',
  name: '',
  phoneNumber: '',
  surname: '',
};

const toFormValues = (user?: User | null): UserFormValues =>
  user
    ? {
        birthDate: user.birthDate ?? '',
        ci: user.ci,
        email: user.email ?? '',
        name: user.name,
        phoneNumber: user.phoneNumber ?? '',
        surname: user.surname,
      }
    : emptyValues;

const cleanOptional = (value?: string) => {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
};

function toCreatePayload(values: UserFormValues): CreateUserDto {
  return {
    birthDate: cleanOptional(values.birthDate),
    ci: values.ci.trim(),
    email: values.email.trim(),
    name: values.name.trim(),
    phoneNumber: cleanOptional(values.phoneNumber),
    surname: values.surname.trim(),
  };
}

function toUpdatePayload(values: UserFormValues): UpdateUserDto {
  return {
    birthDate: cleanOptional(values.birthDate),
    email: values.email.trim(),
    phoneNumber: cleanOptional(values.phoneNumber),
  };
}

export default function UserFormDialog({ onClose, open, user }: UserFormDialogProps) {
  const isEditMode = Boolean(user);
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<UserFormValues>({
    defaultValues: emptyValues,
    mode: 'onBlur',
    resolver: zodResolver(createUserSchema),
  });

  useEffect(() => {
    if (open) {
      reset(toFormValues(user));
    }
  }, [open, reset, user]);

  const isSaving = createUserMutation.isPending || updateUserMutation.isPending;

  const handleClose = () => {
    if (!isSaving) {
      setSubmitError(null);
      onClose();
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      if (user) {
        await updateUserMutation.mutateAsync({
          id: user.id,
          payload: toUpdatePayload(values),
        });
      } else {
        await createUserMutation.mutateAsync(toCreatePayload(values));
      }

      handleClose();
    } catch (error) {
      if (!applyApiFieldErrors(error, setError)) {
        setSubmitError(getApiErrorMessage(error, 'No se pudo guardar el usuario'));
      }
    }
  });

  return (
    <FormDialog
      error={submitError}
      formId="user-form"
      isSubmitting={isSaving}
      onClose={handleClose}
      onSubmit={onSubmit}
      open={open}
      title={isEditMode ? 'Actualizar usuario' : 'Nuevo usuario'}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField
          error={Boolean(errors.name)}
          fullWidth
          helperText={errors.name?.message}
          label="Nombre"
          slotProps={{
            input: {
              readOnly: isEditMode,
              startAdornment: (
                <InputAdornment position="start">
                  <PersonRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          {...register('name')}
        />
        <TextField
          error={Boolean(errors.surname)}
          fullWidth
          helperText={errors.surname?.message}
          label="Apellido"
          slotProps={{
            input: {
              readOnly: isEditMode,
              startAdornment: (
                <InputAdornment position="start">
                  <PersonRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          {...register('surname')}
        />
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField
          error={Boolean(errors.ci)}
          fullWidth
          helperText={errors.ci?.message}
          label="Cedula"
          slotProps={{
            input: {
              readOnly: isEditMode,
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          {...register('ci')}
        />
        <TextField
          error={Boolean(errors.email)}
          fullWidth
          helperText={errors.email?.message}
          label="Correo"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          type="email"
          {...register('email')}
        />
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField
          error={Boolean(errors.phoneNumber)}
          fullWidth
          helperText={errors.phoneNumber?.message}
          label="Telefono"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          {...register('phoneNumber')}
        />
        <Controller
          control={control}
          name="birthDate"
          render={({ field }) => (
            <DatePicker
              label="Fecha de nacimiento"
              onChange={(value) => field.onChange(value?.isValid() ? value.format('YYYY-MM-DD') : '')}
              value={field.value ? dayjs(field.value) : null}
              slotProps={{
                textField: {
                  error: Boolean(errors.birthDate),
                  fullWidth: true,
                  helperText: errors.birthDate?.message,
                  slotProps: {
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthRounded fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  },
                },
              }}
            />
          )}
        />
      </Stack>
    </FormDialog>
  );
}
