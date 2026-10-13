import { useEffect, useRef } from 'react';

import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { useInvoiceQr, useQrPaymentStatus } from 'modules/invoices/hooks/useInvoiceQr';
import type { QrPaymentStatusType } from 'modules/invoices/types/invoice-qr.types';
import StatusPill from 'shared/ui/aqua/StatusPill';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';
import { formatCurrency } from 'shared/utils/formatters';

type InvoiceQrPaymentProps = {
  /** Solo genera/sondea el QR mientras esté activo (p. ej. método = QR y el diálogo/página está visible). */
  active: boolean;
  invoiceId: string;
  onPaid?: () => void;
};

/**
 * El backend a veces devuelve el base64 "pelado" (sin el prefijo data URI),
 * lo que hace que el navegador no pueda renderizar la imagen en un <img src>.
 */
function toQrImageSrc(qrImage: string) {
  return qrImage.startsWith('data:') ? qrImage : `data:image/png;base64,${qrImage}`;
}

function getStatusPillProps(status: QrPaymentStatusType) {
  switch (status) {
    case 'PAID':
      return { label: 'Pagado', tone: 'success' as const, pulse: false };
    case 'EXPIRED':
      return { label: 'Expirado', tone: 'error' as const, pulse: false };
    case 'CANCELLED':
      return { label: 'Cancelado', tone: 'error' as const, pulse: false };
    case 'ERROR':
      return { label: 'Error', tone: 'error' as const, pulse: false };
    case 'GENERATING':
      return { label: 'Generando...', tone: 'warning' as const, pulse: true };
    case 'PENDING':
    default:
      return { label: 'Esperando pago', tone: 'warning' as const, pulse: true };
  }
}

export default function InvoiceQrPayment({ active, invoiceId, onPaid }: InvoiceQrPaymentProps) {
  const qrQuery = useInvoiceQr(invoiceId, active);
  const qr = qrQuery.data;

  const statusQuery = useQrPaymentStatus(active ? invoiceId : undefined);
  const status = statusQuery.data?.qrStatus ?? qr?.status;
  const isDuplicate = Boolean(statusQuery.data?.duplicate);

  const paidNotifiedRef = useRef(false);
  useEffect(() => {
    if (status === 'PAID' && !paidNotifiedRef.current) {
      paidNotifiedRef.current = true;
      onPaid?.();
    } else if (status !== 'PAID') {
      paidNotifiedRef.current = false;
    }
  }, [status, onPaid]);

  if (!active) return null;

  if (qrQuery.isLoading) {
    return (
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', p: 3 }} spacing={1.5}>
        <CircularProgress size={32} />
        <Typography variant="caption" color="text.secondary">
          Generando código QR...
        </Typography>
      </Stack>
    );
  }

  if (qrQuery.isError) {
    return (
      <Stack spacing={1.5}>
        <Alert severity="error">
          {getApiErrorMessage(qrQuery.error, 'No se pudo generar el código QR de pago')}
        </Alert>
        <Button
          onClick={() => void qrQuery.refetch()}
          startIcon={<RefreshRounded />}
          variant="outlined"
          size="small"
        >
          Reintentar
        </Button>
      </Stack>
    );
  }

  if (!qr || !status) return null;

  const isTerminalFailure = status === 'EXPIRED' || status === 'CANCELLED' || status === 'ERROR';
  const isPaid = status === 'PAID';
  const statusProps = getStatusPillProps(status);

  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: 'center',
        width: '100%',
        p: { xs: 2.5, sm: 3 },
        bgcolor: 'background.default',
        borderRadius: 3,
        border: '1px dashed',
        borderColor: 'divider',
      }}
    >
      <StatusPill {...statusProps} />

      {!isPaid && !isTerminalFailure && (
        <Box
          sx={{
            width: '100%',
            maxWidth: 320,
            aspectRatio: '1',
            bgcolor: '#fff',
            p: { xs: 1.5, sm: 2 },
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.14)',
          }}
        >
          <Box
            component="img"
            src={toQrImageSrc(qr.qrImage)}
            alt="Código QR de pago"
            sx={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
          />
        </Box>
      )}

      {isPaid && (
        <Stack spacing={1} sx={{ alignItems: 'center', py: 2 }}>
          <CheckCircleRounded color="success" sx={{ fontSize: 64 }} />
          <Typography variant="body1" color="success.main" sx={{ fontWeight: 700, textAlign: 'center' }}>
            ¡Pago confirmado! Actualizando factura...
          </Typography>
          {isDuplicate && (
            <Alert severity="info" sx={{ width: '100%' }}>
              La factura ya estaba pagada por otra vía; este pago QR quedó registrado para
              conciliación.
            </Alert>
          )}
        </Stack>
      )}

      {!isPaid && !isTerminalFailure && (
        <Stack spacing={1} sx={{ alignItems: 'center', width: '100%' }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontWeight: 500 }}>
            Escanea el QR desde tu aplicación móvil bancaria
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 800 }}>
              {formatCurrency(qr.amount)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
              · Vence {dayjs(qr.expirationDate).format('DD MMM YYYY')}
            </Typography>
          </Stack>
          {statusQuery.isError && (
            <Alert severity="warning" sx={{ width: '100%' }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="caption">No se pudo verificar el estado del pago.</Typography>
                <Button size="small" onClick={() => void statusQuery.refetch()}>
                  Reintentar
                </Button>
              </Stack>
            </Alert>
          )}
        </Stack>
      )}

      {isTerminalFailure && (
        <Stack spacing={1} sx={{ width: '100%', alignItems: 'center' }}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {status === 'EXPIRED' && 'El código QR expiró.'}
            {status === 'CANCELLED' && 'El código QR fue cancelado.'}
            {status === 'ERROR' && 'Ocurrió un error al generar el QR.'}
          </Alert>
          <Button
            onClick={() => void qrQuery.refetch()}
            startIcon={<RefreshRounded />}
            variant="outlined"
            size="small"
          >
            Generar nuevo QR
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
