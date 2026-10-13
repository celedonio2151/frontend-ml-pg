import { zodResolver } from '@hookform/resolvers/zod';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import FormDialog from 'components/FormDialog';
import { useCreateAdjustmentMutation } from 'modules/treasury/hooks/useTreasury';
import {
  treasuryAdjustmentSchema,
  type TreasuryAdjustmentFormValues,
} from 'modules/treasury/schemas/treasury.schemas';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';
import { TreasuryMovement } from '../types/treasury.types';

type TreasuryAdjustmentDialogProps = {
  onClose: () => void;
  open: boolean;
};

const emptyValues: TreasuryAdjustmentFormValues = {
  type: 'INCOME',
  amount: 0,
  description: '',
};

export default function TreasuryAdjustmentDialog({ onClose, open }: TreasuryAdjustmentDialogProps) {
  const createAdjustmentMutation = useCreateAdjustmentMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isSaving = createAdjustmentMutation.isPending;

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<TreasuryAdjustmentFormValues>({
    defaultValues: emptyValues,
    mode: 'onBlur',
    resolver: zodResolver(treasuryAdjustmentSchema),
  });

  useEffect(() => {
    if (open) {
      reset(emptyValues);
    }
  }, [open, reset]);

  const handleClose = () => {
    if (!isSaving) {
      setSubmitError(null);
      onClose();
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await createAdjustmentMutation.mutateAsync({
        type: values.type,
        amount: values.amount,
        description: values.description.trim(),
      });
      handleClose();
    } catch (error) {
      if (!applyApiFieldErrors(error, setError)) {
        setSubmitError(getApiErrorMessage(error, 'No se pudo registrar el ajuste de caja'));
      }
    }
  });

  return (
    <FormDialog
      error={submitError}
      formId="treasury-adjustment-form"
      isSubmitting={isSaving}
      onClose={handleClose}
      onSubmit={onSubmit}
      open={open}
      title="Registrar Ajuste Manual de Caja"
    >
      <Stack spacing={2.5}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              fullWidth
              error={Boolean(errors.type)}
              helperText={errors.type?.message}
              label="Tipo de Ajuste"
            >
              {TreasuryMovement.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <TextField
          {...register('amount')}
          error={Boolean(errors.amount)}
          fullWidth
          helperText={errors.amount?.message}
          label="Monto"
          type="number"
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">Bs.</InputAdornment>,
            },
          }}
        />

        <TextField
          {...register('description')}
          error={Boolean(errors.description)}
          fullWidth
          helperText={errors.description?.message}
          label="Descripción / Motivo"
          multiline
          minRows={3}
          placeholder="Ej: Donación recibida o Compra menor de insumos..."
        />
      </Stack>
    </FormDialog>
  );
}
