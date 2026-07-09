import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ShieldRounded from '@mui/icons-material/ShieldRounded';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import FormDialog from 'components/FormDialog';
import { useUpdateRoleMutation } from 'modules/roles/hooks/useRoles';
import { roleSchema, type RoleFormValues } from 'modules/roles/schemas/role.schemas';
import { RoleName, type Role } from 'modules/roles/types/role.types';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type RoleFormDialogProps = {
  onClose: () => void;
  open: boolean;
  role?: Role | null;
};

const emptyValues: RoleFormValues = {
  description: '',
};

const toFormValues = (role?: Role | null): RoleFormValues => ({
  description: role?.description ?? '',
});

export default function RoleFormDialog({ onClose, open, role }: RoleFormDialogProps) {
  const updateRoleMutation = useUpdateRoleMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isSaving = updateRoleMutation.isPending;

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<RoleFormValues>({
    defaultValues: emptyValues,
    mode: 'onBlur',
    resolver: zodResolver(roleSchema),
  });

  useEffect(() => {
    if (open) {
      reset(toFormValues(role));
    }
  }, [open, reset, role]);

  const handleClose = () => {
    if (!isSaving) {
      setSubmitError(null);
      onClose();
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!role) return;

    setSubmitError(null);

    try {
      await updateRoleMutation.mutateAsync({
        id: role.id,
        payload: { description: values.description.trim() },
      });
      handleClose();
    } catch (error) {
      if (!applyApiFieldErrors(error, setError)) {
        setSubmitError(getApiErrorMessage(error, 'No se pudo actualizar el rol'));
      }
    }
  });

  return (
    <FormDialog
      disableSubmit={!role}
      error={submitError}
      formId="role-form"
      isSubmitting={isSaving}
      onClose={handleClose}
      onSubmit={onSubmit}
      open={open}
      title="Editar rol"
    >
      <Stack direction={{ xs: 'column' }} spacing={2}>
        <TextField
          disabled
          fullWidth
          label="Nombre"
          value={role ? RoleName.getLabelSafe(role.name, role.name) : ''}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <ShieldRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          error={Boolean(errors.description)}
          fullWidth
          helperText={errors.description?.message}
          label="Descripcion"
          multiline
          minRows={3}
          {...register('description')}
        />

        <FormControlLabel disabled control={<Switch checked={role?.status} />} label="Estado" />
      </Stack>
    </FormDialog>
  );
}
