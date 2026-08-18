import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';

import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import FormDialog from 'components/FormDialog';
import {
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
} from 'modules/expenses/hooks/useExpenses';
import {
  expenseSchema,
  type ExpenseFormValues,
} from 'modules/expenses/schemas/expense.schemas';
import {
  ExpenseCategory,
  type Expense,
} from 'modules/expenses/types/expense.types';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type ExpenseFormDialogProps = {
  expense?: Expense | null;
  onClose: () => void;
  open: boolean;
};

const emptyValues: ExpenseFormValues = {
  amount: 0,
  category: 'MAINTENANCE',
  description: '',
  expenseDate: dayjs().format('YYYY-MM-DD'),
  receiptImage: '',
  receiptNumber: '',
};

const toFormValues = (expense?: Expense | null): ExpenseFormValues =>
  expense
    ? {
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        expenseDate: expense.expenseDate || dayjs().format('YYYY-MM-DD'),
        receiptImage: expense.receiptImage ?? '',
        receiptNumber: expense.receiptNumber ?? '',
      }
    : emptyValues;

export default function ExpenseFormDialog({
  expense,
  onClose,
  open,
}: ExpenseFormDialogProps) {
  const isEditMode = Boolean(expense);
  const createMutation = useCreateExpenseMutation();
  const updateMutation = useUpdateExpenseMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<ExpenseFormValues>({
    defaultValues: emptyValues,
    mode: 'onBlur',
    resolver: zodResolver(expenseSchema),
  });

  useEffect(() => {
    if (open) {
      reset(toFormValues(expense));
    }
  }, [expense, open, reset]);

  const handleClose = () => {
    if (!isSaving) {
      setSubmitError(null);
      onClose();
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    const payload = {
      amount: values.amount,
      category: values.category,
      description: values.description.trim(),
      expenseDate: values.expenseDate,
      receiptImage: values.receiptImage?.trim() || undefined,
      receiptNumber: values.receiptNumber?.trim() || undefined,
    };

    try {
      if (expense) {
        await updateMutation.mutateAsync({
          id: expense.id,
          payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      handleClose();
    } catch (error) {
      if (!applyApiFieldErrors(error, setError)) {
        setSubmitError(
          getApiErrorMessage(
            error,
            isEditMode ? 'No se pudo actualizar el gasto' : 'No se pudo registrar el gasto',
          ),
        );
      }
    }
  });

  return (
    <FormDialog
      error={submitError}
      formId="expense-form"
      isSubmitting={isSaving}
      onClose={handleClose}
      onSubmit={onSubmit}
      open={open}
      title={isEditMode ? 'Editar Gasto' : 'Registrar Nuevo Gasto'}
    >
      <Stack spacing={2.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <TextField
                {...field}
                error={Boolean(errors.category)}
                fullWidth
                helperText={errors.category?.message}
                label="Categoría"
                select
              >
                {ExpenseCategory.options.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <TextField
            error={Boolean(errors.amount)}
            fullWidth
            helperText={errors.amount?.message}
            label="Monto"
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">Bs.</InputAdornment>,
                inputProps: { min: 0.01, step: 'any' },
              },
            }}
            type="number"
            {...register('amount')}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Controller
            control={control}
            name="expenseDate"
            render={({ field }) => (
              <DatePicker
                label="Fecha del gasto"
                onChange={(value) =>
                  field.onChange(value?.isValid() ? value.format('YYYY-MM-DD') : '')
                }
                slotProps={{
                  textField: {
                    error: Boolean(errors.expenseDate),
                    fullWidth: true,
                    helperText: errors.expenseDate?.message,
                  },
                }}
                value={field.value ? dayjs(field.value) : null}
              />
            )}
          />

          <TextField
            error={Boolean(errors.receiptNumber)}
            fullWidth
            helperText={errors.receiptNumber?.message}
            label="Nº Recibo / Comprobante (opcional)"
            placeholder="Ej: REC-2026-0012"
            {...register('receiptNumber')}
          />
        </Stack>

        <TextField
          error={Boolean(errors.description)}
          fullWidth
          helperText={errors.description?.message}
          label="Descripción detallada"
          minRows={3}
          multiline
          placeholder="Ej: Compra de insumos de plomería para tubería principal..."
          {...register('description')}
        />

        <TextField
          error={Boolean(errors.receiptImage)}
          fullWidth
          helperText={errors.receiptImage?.message ?? 'URL o enlace al comprobante guardado'}
          label="URL del Comprobante / Foto (opcional)"
          placeholder="https://..."
          {...register('receiptImage')}
        />
      </Stack>
    </FormDialog>
  );
}
