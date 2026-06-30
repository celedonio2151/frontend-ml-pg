import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
    <Dialog fullWidth maxWidth="sm" onClose={handleClose} open={open}>
      <DialogTitle sx={{ fontWeight: 900 }}>
        {isEditMode ? 'Actualizar usuario' : 'Nuevo usuario'}
      </DialogTitle>
      <DialogContent>
        <Stack component="form" id="user-form" onSubmit={onSubmit} spacing={2.25} sx={{ pt: 1 }}>
          {submitError ? <Alert severity="error">{submitError}</Alert> : null}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              error={Boolean(errors.name)}
              fullWidth
              helperText={errors.name?.message}
              label="Nombre"
              slotProps={{ input: { readOnly: isEditMode } }}
              {...register('name')}
            />
            <TextField
              error={Boolean(errors.surname)}
              fullWidth
              helperText={errors.surname?.message}
              label="Apellido"
              slotProps={{ input: { readOnly: isEditMode } }}
              {...register('surname')}
            />
          </Stack>

          <TextField
            error={Boolean(errors.ci)}
            fullWidth
            helperText={errors.ci?.message}
            label="Cedula"
            slotProps={{ input: { readOnly: isEditMode } }}
            {...register('ci')}
          />

          <TextField
            error={Boolean(errors.email)}
            fullWidth
            helperText={errors.email?.message}
            label="Correo"
            type="email"
            {...register('email')}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              error={Boolean(errors.phoneNumber)}
              fullWidth
              helperText={errors.phoneNumber?.message}
              label="Telefono"
              {...register('phoneNumber')}
            />
            <TextField
              error={Boolean(errors.birthDate)}
              fullWidth
              helperText={errors.birthDate?.message}
              label="Fecha de nacimiento"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('birthDate')}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button disabled={isSaving} onClick={handleClose}>
          Cancelar
        </Button>
        <Button disabled={isSaving} form="user-form" type="submit" variant="contained">
          {isSaving ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
