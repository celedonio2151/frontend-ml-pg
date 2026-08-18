import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import GasMeterRounded from '@mui/icons-material/GasMeterRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import ReceiptRounded from '@mui/icons-material/ReceiptRounded';
import SpeedRounded from '@mui/icons-material/SpeedRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import type { ElementType, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router';

import ReadingFormDialog from 'modules/readings/components/ReadingFormDialog';
import { useReading } from 'modules/readings/hooks/useReadings';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import SectionHeader from 'shared/ui/aqua/SectionHeader';
import StatusPill from 'shared/ui/aqua/StatusPill';
import paths from 'router/paths';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';
import { formatCubicMeters, formatCurrency, formateDate } from 'shared/utils/formatters';

const invoiceStatusLabel: Record<string, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagada',
  CANCELLED: 'Cancelada',
};

/* ------------------------------------------------------------------ */
/*  Detail Item                                                        */
/* ------------------------------------------------------------------ */

type DetailItemProps = {
  icon: ElementType;
  label: string;
  value: ReactNode;
};

function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start', minWidth: 0 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 2,
          display: 'grid',
          flexShrink: 0,
          placeItems: 'center',
          color: 'primary.light',
          bgcolor: 'rgba(6, 182, 212, 0.12)',
        }}
      >
        <Icon fontSize="small" />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography color="text.secondary" variant="caption">
          {label}
        </Typography>
        <Typography component="div" variant="body2" sx={{ fontWeight: 800 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/*  Metric Card                                                        */
/* ------------------------------------------------------------------ */

function MetricCard({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <AquaPanel
      hover
      liquid
      sx={{
        textAlign: 'center',
        borderColor: highlight ? 'rgba(34, 211, 238, 0.30)' : undefined,
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}
      >
        {label}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          fontWeight: 900,
          color: highlight ? 'primary.light' : 'text.primary',
          mt: 0.5,
        }}
      >
        {value}
      </Typography>
      {sub ? (
        <Typography variant="caption" color="text.secondary">
          {sub}
        </Typography>
      ) : null}
    </AquaPanel>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ReadingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);

  const readingQuery = useReading(id);
  const reading = readingQuery.data;

  const isLoading = readingQuery.isLoading;

  return (
    <Stack spacing={3}>
      {/* Header */}
      <SectionHeader
        eyebrow="Lecturas"
        title="Detalle de lectura"
        subtitle="Información completa de la lectura, medidor y factura asociada."
        action={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              onClick={() => void navigate(paths.admin.readings)}
              startIcon={<ArrowBackRounded />}
              variant="outlined"
            >
              Volver
            </Button>
            <Button
              disabled={!reading || readingQuery.isFetching}
              onClick={() => setFormOpen(true)}
              startIcon={<EditRounded />}
              variant="contained"
            >
              Editar
            </Button>
          </Stack>
        }
      />

      {/* Error */}
      {readingQuery.isError ? (
        <Alert severity="error">
          {getApiErrorMessage(readingQuery.error, 'No se pudo cargar la lectura')}
        </Alert>
      ) : null}

      {/* Metric Cards */}
      <Grid container spacing={2}>
        {[
          {
            label: 'Lectura Anterior',
            value: isLoading ? '–' : formatCubicMeters(reading?.beforeMonth?.value ?? 0),
            sub: isLoading
              ? undefined
              : reading?.beforeMonth?.date
                ? formateDate(reading.beforeMonth.date, 'MMM YYYY')
                : undefined,
          },
          {
            label: 'Lectura Actual',
            value: isLoading ? '–' : formatCubicMeters(reading?.lastMonth?.value ?? 0),
            sub: isLoading
              ? undefined
              : reading?.lastMonth?.date
                ? formateDate(reading.lastMonth.date, 'MMM YYYY')
                : undefined,
            highlight: true,
          },
          {
            label: 'Consumo',
            value: isLoading ? '–' : formatCubicMeters(reading?.cubicMeters ?? 0),
          },
          {
            label: 'Balance generado',
            value: isLoading ? '–' : formatCurrency(reading?.balance ?? 0),
          },
        ].map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
            {isLoading ? (
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 3 }} />
            ) : (
              <MetricCard {...card} />
            )}
          </Grid>
        ))}
      </Grid>

      {/* Detail Sections */}
      <Grid container spacing={2}>
        {/* Socio & Medidor */}
        <Grid size={{ xs: 12, md: 6 }}>
          <AquaPanel liquid sx={{ height: '100%' }}>
            <Stack spacing={2.5}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                Socio y Medidor
              </Typography>
              <Divider />
              {isLoading ? (
                <Stack spacing={2}>
                  {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
                  ))}
                </Stack>
              ) : (
                <Stack spacing={2}>
                  <DetailItem
                    icon={PersonRounded}
                    label="Propietario"
                    value={`${reading?.ownerName ?? '–'} ${reading?.ownerSurname ?? ''}`}
                  />
                  <DetailItem icon={PersonRounded} label="CI" value={reading?.ownerCi ?? '–'} />
                  <DetailItem
                    icon={SpeedRounded}
                    label="Número de Medidor"
                    value={
                      reading?.meter?.meterNumber
                        ? `#${reading.meter.meterNumber}`
                        : (reading?.meterId ?? '–')
                    }
                  />
                  <DetailItem
                    icon={GasMeterRounded}
                    label="Capacidad Máxima"
                    value={
                      reading?.meter?.maximumCapacity
                        ? formatCubicMeters(reading.meter.maximumCapacity)
                        : '–'
                    }
                  />
                </Stack>
              )}
            </Stack>
          </AquaPanel>
        </Grid>

        {/* Detalles de la Lectura */}
        <Grid size={{ xs: 12, md: 6 }}>
          <AquaPanel liquid sx={{ height: '100%' }}>
            <Stack spacing={2.5}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                Detalles de la Lectura
              </Typography>
              <Divider />
              {isLoading ? (
                <Stack spacing={2}>
                  {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
                  ))}
                </Stack>
              ) : (
                <Stack spacing={2}>
                  <DetailItem
                    icon={CalendarMonthRounded}
                    label="Fecha de lectura"
                    value={
                      reading?.date
                        ? formateDate(reading.date, 'DD [de] MMMM YYYY [a las] HH:mm')
                        : '–'
                    }
                  />
                  <DetailItem
                    icon={DescriptionRounded}
                    label="Descripción"
                    value={reading?.description || 'Sin descripción'}
                  />
                  <DetailItem
                    icon={SpeedRounded}
                    label="¿Rollover?"
                    value={
                      <StatusPill
                        label={reading?.isRollover ? 'Si' : 'No'}
                        pulse={reading?.isRollover}
                        tone={reading?.isRollover ? 'warning' : 'aqua'}
                      />
                    }
                  />
                  <DetailItem
                    icon={CalendarMonthRounded}
                    label="Creado"
                    value={
                      reading?.createdAt
                        ? formateDate(String(reading.createdAt), 'DD MMM YYYY HH:mm')
                        : '–'
                    }
                  />
                </Stack>
              )}
            </Stack>
          </AquaPanel>
        </Grid>

        {/* Imagen del medidor */}
        {isLoading || reading?.meterImage ? (
          <Grid size={{ xs: 12, md: 6 }}>
            <AquaPanel liquid>
              <Stack spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                  Foto del Medidor
                </Typography>
                <Divider />
                {isLoading ? (
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                ) : (
                  <Box
                    component="img"
                    src={reading?.meterImage}
                    alt="Imagen del medidor"
                    sx={{
                      width: '100%',
                      maxHeight: 280,
                      objectFit: 'cover',
                      borderRadius: 2,
                      border: '1px solid rgba(34, 211, 238, 0.20)',
                    }}
                  />
                )}
              </Stack>
            </AquaPanel>
          </Grid>
        ) : null}

        {/* Factura */}
        <Grid size={{ xs: 12, md: reading?.meterImage || isLoading ? 6 : 12 }}>
          <AquaPanel liquid sx={{ height: '100%' }}>
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                  Factura Asociada
                </Typography>
                {!isLoading && reading?.invoice ? (
                  <StatusPill
                    label={invoiceStatusLabel[reading.invoice.status] ?? reading.invoice.status}
                    pulse={reading.invoice.status === 'PENDING'}
                    tone={
                      reading.invoice.status === 'PAID'
                        ? 'success'
                        : reading.invoice.status === 'CANCELLED'
                          ? 'error'
                          : 'warning'
                    }
                  />
                ) : null}
              </Stack>
              <Divider />
              {isLoading ? (
                <Stack spacing={2}>
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
                  ))}
                </Stack>
              ) : !reading?.invoice ? (
                <Typography color="text.secondary" variant="body2">
                  Esta lectura no tiene factura asociada.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  <DetailItem
                    icon={ReceiptRounded}
                    label="Monto"
                    value={formatCurrency(Number(reading.invoice.amountDue))}
                  />
                  {reading.invoice.dueDate ? (
                    <DetailItem
                      icon={CalendarMonthRounded}
                      label="Vencimiento"
                      value={formateDate(reading.invoice.dueDate, 'DD MMM YYYY')}
                    />
                  ) : null}
                  {reading.invoice.paymentDate ? (
                    <DetailItem
                      icon={CalendarMonthRounded}
                      label="Fecha de pago"
                      value={formateDate(reading.invoice.paymentDate, 'DD MMM YYYY')}
                    />
                  ) : null}
                  {reading.invoice.paymentMethod ? (
                    <DetailItem
                      icon={ReceiptRounded}
                      label="Método de pago"
                      value={
                        <Chip
                          label={reading.invoice.paymentMethod}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      }
                    />
                  ) : null}
                  {reading.invoice.notes ? (
                    <DetailItem
                      icon={DescriptionRounded}
                      label="Notas"
                      value={reading.invoice.notes}
                    />
                  ) : null}
                </Stack>
              )}
            </Stack>
          </AquaPanel>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      {reading ? (
        <ReadingFormDialog onClose={() => setFormOpen(false)} open={formOpen} reading={reading} />
      ) : null}
    </Stack>
  );
}
