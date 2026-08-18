import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import AccountBalanceRounded from '@mui/icons-material/AccountBalanceRounded';
import LocalAtmRounded from '@mui/icons-material/LocalAtmRounded';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import NotesRounded from '@mui/icons-material/NotesRounded';
import QrCodeRounded from '@mui/icons-material/QrCodeRounded';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import FormDialog from 'components/FormDialog';
import { usePayInvoiceMutation } from 'modules/invoices/hooks/useInvoices';
import { payInvoiceSchema, type PayInvoiceValues } from 'modules/invoices/schemas/invoice.schemas';
import type { Invoice } from 'modules/invoices/types/invoice.types';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type PayInvoiceDialogProps = {
  invoice: Invoice | null;
  onClose: () => void;
  open: boolean;
};

export default function PayInvoiceDialog({ invoice, onClose, open }: PayInvoiceDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const payMutation = usePayInvoiceMutation();

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<PayInvoiceValues>({
    defaultValues: {
      paymentMethod: 'CASH',
      notes: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(payInvoiceSchema),
  });

  const { isPending, reset: resetMutation } = payMutation;

  useEffect(() => {
    if (open && invoice) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubmitError(null);
      reset({ paymentMethod: 'CASH', notes: '' });
    } else if (!open) {
      resetMutation();
    }
  }, [invoice, open, reset, resetMutation]);

  const handleClose = useCallback(() => {
    if (isPending) return;
    onClose();
  }, [isPending, onClose]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    if (!invoice?.id) return;

    try {
      await payMutation.mutateAsync({
        id: invoice.id,
        payload: {
          paymentMethod: values.paymentMethod,
          notes: values.notes,
        },
      });
      handleClose();
    } catch (error) {
      if (!applyApiFieldErrors(error, setError)) {
        setSubmitError(getApiErrorMessage(error, 'No se pudo procesar el pago de la factura'));
      }
    }
  });

  return (
    <FormDialog
      error={submitError}
      formId="pay-invoice-form"
      isSubmitting={payMutation.isPending}
      maxWidth="sm"
      onClose={handleClose}
      onSubmit={onSubmit}
      open={open}
      title="Pagar factura"
      submitLabel="Confirmar pago"
      submittingLabel="Procesando..."
    >
      <Stack spacing={3}>
        {invoice ? (
          <Stack spacing={0.5} sx={{ bgcolor: 'rgba(6, 182, 212, 0.04)', p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Monto a pagar:
            </Typography>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 900 }}>
              Bs.{' '}
              {invoice.amountDue.toLocaleString('es-BO', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Factura #{invoice.id.split('-')[0].toUpperCase()}
            </Typography>
          </Stack>
        ) : null}

        <Controller
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Método de pago
              </Typography>
              <ToggleButtonGroup
                {...field}
                exclusive
                fullWidth
                onChange={(_, newValue) => {
                  if (newValue !== null) {
                    field.onChange(newValue);
                  }
                }}
                color="primary"
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 1.5,
                  '& .MuiToggleButtonGroup-grouped': {
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '12px !important',
                    p: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    textTransform: 'none',
                    transition: 'all 0.2s',
                    '&.Mui-selected': {
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(6, 182, 212, 0.08)',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'rgba(6, 182, 212, 0.12)',
                      },
                    },
                  },
                }}
              >
                <ToggleButton value="CASH">
                  <LocalAtmRounded />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Efectivo
                  </Typography>
                </ToggleButton>
                <ToggleButton value="TRANSFER">
                  <AccountBalanceRounded />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Transferencia
                  </Typography>
                </ToggleButton>
                <ToggleButton value="QR">
                  <QrCodeRounded />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Código QR
                  </Typography>
                </ToggleButton>
                <ToggleButton value="OTHER">
                  <MoreHorizRounded />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Otro
                  </Typography>
                </ToggleButton>
              </ToggleButtonGroup>
              {errors.paymentMethod && (
                <FormHelperText error sx={{ mx: 0 }}>
                  {errors.paymentMethod.message}
                </FormHelperText>
              )}
            </Stack>
          )}
        />

        <TextField
          error={Boolean(errors.notes)}
          fullWidth
          helperText={errors.notes?.message}
          label="Notas adicionales (opcional)"
          multiline
          rows={3}
          size="medium"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mt: -5 }}>
                  <NotesRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          {...register('notes')}
        />
      </Stack>
    </FormDialog>
  );
}
