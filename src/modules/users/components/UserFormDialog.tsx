import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// MUI ICONS
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import ContactEmergencyRoundedIcon from '@mui/icons-material/ContactEmergencyRounded';
import EmailRounded from '@mui/icons-material/EmailRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import PhoneRounded from '@mui/icons-material/PhoneRounded';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormDialog from 'components/FormDialog';
import { useRoles } from 'modules/roles/hooks/useRoles';
import { useCreateUserMutation, useUpdateUserMutation } from 'modules/users/hooks/useUsers';
import { createUserSchema, type UserFormValues } from 'modules/users/schemas/user.schemas';
import type {
  CreateUserDto,
  UpdateUserDto,
  UserWithRolesAndMeters,
} from 'modules/users/types/user.types';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type UserFormDialogProps = {
  onClose: () => void;
  open: boolean;
  user?: UserWithRolesAndMeters | null;
};

const emptyValues: UserFormValues = {
  birthDate: '',
  ci: '',
  email: '',
  name: '',
  phoneNumber: '',
  surname: '',
};

const toFormValues = (user?: UserWithRolesAndMeters | null): UserFormValues =>
  user
    ? {
        birthDate: user.birthDate ?? '',
        ci: user.ci,
        email: user.email ?? '',
        name: user.name,
        phoneNumber: user.phoneNumber ?? '',
        surname: user.surname,
        rolIds: user.roles?.map((r) => r.id) ?? [],
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
    email: values.email?.trim() || undefined,
    phoneNumber: cleanOptional(values.phoneNumber),
    rolIds: values.rolIds,
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

  const rolesQuery = useRoles();
  const roles = rolesQuery.data?.items ?? []; // TODO Implementar loading

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    // Validate email for ADMIN role
    if (isEditMode) {
      const adminRole = roles.find((r) => r.name === 'ADMIN');
      const hasAdminRole = adminRole && values.rolIds?.includes(adminRole.id);

      if (hasAdminRole && !values.email?.trim()) {
        setError('email', { message: 'El correo es obligatorio para los administradores' });
        return;
      }
    }

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
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            error={Boolean(errors.name)}
            fullWidth
            helperText={errors.name?.message}
            label="Nombre"
            size="medium"
            slotProps={{
              input: {
                readOnly: isEditMode,
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRounded fontSize="medium" />
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
            size="medium"
            slotProps={{
              input: {
                readOnly: isEditMode,
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRounded fontSize="medium" />
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
            label="Carnet de identidad"
            size="medium"
            slotProps={{
              input: {
                readOnly: isEditMode,
                startAdornment: (
                  <InputAdornment position="start">
                    <ContactEmergencyRoundedIcon fontSize="medium" />
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
            size="medium"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailRounded fontSize="medium" />
                  </InputAdornment>
                ),
              },
            }}
            type="email"
            {...register('email')}
          />
        </Stack>

        {isEditMode && (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Controller
              name="rolIds"
              control={control}
              defaultValue={user?.roles.map((r) => r.id) ?? []}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error}>
                  <InputLabel id="rolIds-select-label">Roles</InputLabel>

                  <Select
                    {...field}
                    labelId="rolIds-select-label"
                    label="Roles"
                    multiple
                    value={field.value ?? []}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>

                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Stack>
        )}

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            error={Boolean(errors.phoneNumber)}
            fullWidth
            helperText={errors.phoneNumber?.message}
            label="Telefono"
            size="medium"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneRounded fontSize="medium" />
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
                onChange={(value) =>
                  field.onChange(value?.isValid() ? value.format('YYYY-MM-DD') : '')
                }
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
                            <CalendarMonthRounded fontSize="medium" />
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
      </Stack>
    </FormDialog>
  );
}
