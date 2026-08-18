import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

// MUI
import AccountBalanceRounded from '@mui/icons-material/AccountBalanceRounded';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import LocalAtmRounded from '@mui/icons-material/LocalAtmRounded';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import NotesRounded from '@mui/icons-material/NotesRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import QrCodeRounded from '@mui/icons-material/QrCodeRounded';
import ReceiptRounded from '@mui/icons-material/ReceiptRounded';
import SpeedRounded from '@mui/icons-material/SpeedRounded';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { useInvoice, usePayInvoiceMutation } from 'modules/invoices/hooks/useInvoices';
import { payInvoiceSchema, type PayInvoiceValues } from 'modules/invoices/schemas/invoice.schemas';
import paths from 'router/paths';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import StatusPill from 'shared/ui/aqua/StatusPill';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';
import { formatCurrency } from 'shared/utils/formatters';
import type { InvoiceStatusType } from '../types/invoice.types';

const getStatusProps = (status: InvoiceStatusType) => {
  switch (status) {
    case 'PAID':
      return { label: 'Pagada', tone: 'success' as const, pulse: false };
    case 'CANCELLED':
      return { label: 'Anulada', tone: 'error' as const, pulse: false };
    case 'PENDING':
    default:
      return { label: 'Pendiente', tone: 'warning' as const, pulse: true };
  }
};

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const invoiceId = id ?? '';

  const { data: invoice, isLoading, isError, error } = useInvoice(invoiceId);
  const payMutation = usePayInvoiceMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setError,
    reset,
  } = useForm<PayInvoiceValues>({
    defaultValues: {
      paymentMethod: 'CASH',
      notes: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(payInvoiceSchema),
  });

  const paymentMethod = useWatch({ control, name: 'paymentMethod' });

  const handleGoBack = useCallback(() => {
    navigate(paths.admin.invoices);
  }, [navigate]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    if (!invoiceId) return;

    try {
      await payMutation.mutateAsync({
        id: invoiceId,
        payload: {
          paymentMethod: values.paymentMethod,
          notes: values.notes,
        },
      });
      reset();
    } catch (err) {
      if (!applyApiFieldErrors(err, setError)) {
        setSubmitError(getApiErrorMessage(err, 'No se pudo procesar el pago de la factura'));
      }
    }
  });

  if (isLoading) {
    return (
      <Stack sx={{ p: 4, alignItems: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Cargando detalles de factura...
        </Typography>
      </Stack>
    );
  }

  if (isError || !invoice) {
    return (
      <Stack spacing={2}>
        <Button
          startIcon={<ArrowBackRounded />}
          onClick={handleGoBack}
          sx={{ alignSelf: 'flex-start' }}
        >
          Volver
        </Button>
        <Alert severity="error">
          {getApiErrorMessage(error, 'No se pudo cargar la información de la factura.')}
        </Alert>
      </Stack>
    );
  }

  const statusProps = getStatusProps(invoice.status);
  const shortId = invoice.id.split('-')[0].toUpperCase();
  const amountDueNum = Number(invoice.amountDue);

  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={2}>
        <Button
          color="inherit"
          onClick={handleGoBack}
          startIcon={<ArrowBackRounded />}
          sx={{ borderRadius: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Factura #{shortId}
        </Typography>
        <StatusPill {...statusProps} />
      </Stack>

      <Grid container spacing={3}>
        {/* Detalles de la Factura y Medidor */}
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <Stack spacing={3}>
            {/* Tarjeta de Resumen */}
            <AquaPanel liquid sx={{ p: 4 }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <ReceiptRounded color="primary" /> Detalle Comercial
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Monto Original
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      {formatCurrency(Number(invoice.originalAmountDue ?? invoice.amountDue))}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Monto a Pagar
                    </Typography>
                    <Typography
                      variant="h5"
                      color="primary.main"
                      sx={{ fontFamily: 'monospace', fontWeight: 900 }}
                    >
                      {formatCurrency(amountDueNum)}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Emisión
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {invoice.issueDate ? dayjs(invoice.issueDate).format('DD MMM YYYY') : '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Vencimiento
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500 }}
                      color={
                        invoice.dueDate &&
                        dayjs().isAfter(invoice.dueDate) &&
                        invoice.status === 'PENDING'
                          ? 'error.main'
                          : 'text.primary'
                      }
                    >
                      {invoice.dueDate ? dayjs(invoice.dueDate).format('DD MMM YYYY') : '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Fecha de Pago
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {invoice.paymentDate
                        ? dayjs(invoice.paymentDate).format('DD MMM YYYY HH:mm')
                        : '-'}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </AquaPanel>

            {/* Tarjeta de Lectura y Propietario */}
            <AquaPanel liquid sx={{ p: 4 }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <PersonRounded color="secondary" /> Información del Propietario
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Nombre Completo
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {invoice.reading.ownerName} {invoice.reading.ownerSurname}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      CI
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                      {invoice.reading.ownerCi}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <SpeedRounded fontSize="small" /> Medidor
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                      #{invoice.reading.meter.meterNumber}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Consumo del mes
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {invoice.reading.cubicMeters} m³
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </AquaPanel>
          </Stack>
        </Grid>

        {/* Sección de Pago */}
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <AquaPanel
            liquid
            sx={{
              p: 4,
              position: 'sticky',
              top: 24,
            }}
          >
            {invoice.status === 'PENDING' ? (
              <Stack component="form" onSubmit={onSubmit} spacing={3}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Procesar Pago
                </Typography>

                {submitError && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {submitError}
                  </Alert>
                )}

                <Controller
                  control={control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <Stack spacing={1.5}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        Método
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
                            QR
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

                {paymentMethod === 'QR' && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 3,
                      bgcolor: 'background.default',
                      borderRadius: 2,
                      border: '1px dashed',
                      borderColor: 'divider',
                    }}
                  >
                    <Box
                      component="img"
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Pago_Factura_${shortId}_Monto_${amountDueNum}`}
                      alt="QR Code"
                      sx={{ width: 160, height: 160, borderRadius: 1 }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 2, textAlign: 'center' }}
                    >
                      Escanea el QR desde tu aplicación móvil bancaria.
                    </Typography>
                  </Box>
                )}

                <TextField
                  error={Boolean(errors.notes)}
                  fullWidth
                  helperText={errors.notes?.message}
                  label="Notas adicionales (opcional)"
                  multiline
                  rows={2}
                  size="small"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ mt: -3 }}>
                          <NotesRounded fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  {...register('notes')}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={payMutation.isPending}
                  sx={{ mt: 2, py: 1.5, borderRadius: 2, fontWeight: 700 }}
                >
                  {payMutation.isPending ? 'Procesando...' : 'Confirmar Pago'}
                </Button>
              </Stack>
            ) : (
              <Stack spacing={3} sx={{ alignItems: 'center', textAlign: 'center', py: 4 }}>
                <Box sx={{ color: 'success.main', mb: -1 }}>
                  <CheckCircleRounded sx={{ fontSize: 64 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }} color="success.main">
                  Factura Pagada
                </Typography>
                <Stack spacing={1} sx={{ width: '100%' }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {invoice.paymentDate
                        ? dayjs(invoice.paymentDate).format('DD MMM YYYY HH:mm')
                        : '-'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Método:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {invoice.paymentMethod ?? '-'}
                    </Typography>
                  </Stack>
                  {invoice.notes && (
                    <Stack
                      direction="column"
                      sx={{
                        mt: 1,
                        p: 1.5,
                        alignItems: 'flex-start',
                        bgcolor: 'background.default',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Notas:
                      </Typography>
                      <Typography variant="body2" sx={{ textAlign: 'left' }}>
                        {invoice.notes}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            )}
          </AquaPanel>
        </Grid>
      </Grid>
    </Stack>
  );
}
