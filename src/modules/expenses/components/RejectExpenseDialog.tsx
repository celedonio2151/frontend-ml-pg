import { zodResolver } from '@hookform/resolvers/zod';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import FormDialog from 'components/FormDialog';
import { useRejectExpenseMutation } from 'modules/expenses/hooks/useExpenses';
import {
  rejectExpenseSchema,
  type RejectExpenseFormValues,
} from 'modules/expenses/schemas/expense.schemas';
import type { Expense } from 'modules/expenses/types/expense.types';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';
import { formatCurrency } from 'shared/utils/formatters';

type RejectExpenseDialogProps = {
  expense?: Expense | null;
  onClose: () => void;
  open: boolean;
};

export default function RejectExpenseDialog({ expense, onClose, open }: RejectExpenseDialogProps) {
  const rejectMutation = useRejectExpenseMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSaving = rejectMutation.isPending;

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<RejectExpenseFormValues>({
    defaultValues: { rejectionReason: '' },
    mode: 'onBlur',
    resolver: zodResolver(rejectExpenseSchema),
  });

  useEffect(() => {
    if (open) {
      reset({ rejectionReason: '' });
    }
  }, [open, reset]);

  const handleClose = () => {
    if (!isSaving) {
      setSubmitError(null);
      onClose();
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!expense) return;
    setSubmitError(null);

    try {
      await rejectMutation.mutateAsync({
        id: expense.id,
        payload: {
          rejectionReason: values.rejectionReason?.trim() || undefined,
        },
      });
      handleClose();
    } catch (error) {
      if (!applyApiFieldErrors(error, setError)) {
        setSubmitError(getApiErrorMessage(error, 'No se pudo rechazar el gasto'));
      }
    }
  });

  return (
    <FormDialog
      error={submitError}
      formId="reject-expense-form"
      isSubmitting={isSaving}
      onClose={handleClose}
      onSubmit={onSubmit}
      open={open}
      submitLabel="Rechazar Gasto"
      submittingLabel="Rechazando..."
      title="Rechazar Registro de Gasto"
    >
      <Stack spacing={2}>
        {expense && (
          <Typography variant="body2" color="text.secondary">
            ¿Está seguro de que desea rechazar el gasto <strong>"{expense.description}"</strong> por
            un monto de <strong>{formatCurrency(expense.amount)}</strong>?
          </Typography>
        )}

        <TextField
          error={Boolean(errors.rejectionReason)}
          fullWidth
          helperText={errors.rejectionReason?.message}
          label="Motivo del rechazo (opcional)"
          minRows={2}
          multiline
          placeholder="Ej: Comprobante no válido o falta de autorización previa..."
          {...register('rejectionReason')}
        />
      </Stack>
    </FormDialog>
  );
}
