import AddRounded from '@mui/icons-material/AddRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import DataTable from 'components/MainTable/DataTable';
import DeleteReadingDialog from 'modules/readings/components/DeleteReadingDialog';
import ReadingFormDialog from 'modules/readings/components/ReadingFormDialog';
import { useReadings } from 'modules/readings/hooks/useReadings';
import type { Reading, ReadingsListParams, ReadingWithMeterAndUser } from 'modules/readings/types/reading.types';
import StatusPill from 'shared/ui/aqua/StatusPill';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';
import { formateDate } from 'shared/utils/formatters';

const rolloverFilterOptions = [
  { label: 'Con rollover', value: true },
  { label: 'Sin rollover', value: false },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-BO', {
    currency: 'BOB',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: 'currency',
  }).format(value);

export default function ReadingPage() {
  const [formReading, setFormReading] = useState<Reading | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteReading, setDeleteReading] = useState<ReadingWithMeterAndUser | null>(null);

  const readingsParams = useMemo<ReadingsListParams>(
    () => ({
      limit: 100,
      page: 1,
      sortBy: [{ order: 'desc', whom: 'date' }],
    }),
    [],
  );

  const readingsQuery = useReadings(readingsParams);
  const readings = readingsQuery.data?.items ?? [];

  const handleCreate = useCallback(() => {
    setFormReading(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((reading: Reading) => {
    setFormReading(reading);
    setFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setFormReading(null);
  }, []);

  const columns = useMemo<ColumnDef<ReadingWithMeterAndUser, unknown>[]>(
    () => [
      {
        accessorFn: (row) => `${row.ownerName} ${row.ownerSurname} ${row.ownerCi}`,
        id: 'owner',
        header: 'Socio',
        meta: { filterVariant: 'text' },
        cell: ({ row }) => (
          <Stack spacing={0.25} sx={{ maxWidth: 280 }}>
            <Typography noWrap variant="body2" sx={{ fontWeight: 850 }}>
              {row.original.ownerName} {row.original.ownerSurname}
            </Typography>
            <Typography
              noWrap
              color="primary.light"
              variant="caption"
              sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace', fontWeight: 800 }}
            >
              CI {row.original.ownerCi}
            </Typography>
          </Stack>
        ),
      },
      {
        accessorFn: (row) => row.meter?.meterNumber ?? row.meterId,
        id: 'meter',
        header: 'Medidor',
        enableColumnFilter: false,
        cell: ({ row }) => (
          <Typography color="primary.light" variant="body2" sx={{ fontWeight: 850 }}>
            {row.original.meter?.meterNumber ? `#${row.original.meter.meterNumber}` : row.original.meterId}
          </Typography>
        ),
      },
      {
        accessorKey: 'date',
        header: 'Fecha',
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <Typography variant="body2" sx={{ fontWeight: 800 }}>
            {formateDate(getValue<string>(), 'DD MMM YYYY HH:mm')}
          </Typography>
        ),
      },
      {
        accessorKey: 'cubicMeters',
        header: 'Consumo m3',
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <Typography color="primary.light" variant="body2" sx={{ fontWeight: 850 }}>
            {getValue<number>().toLocaleString('es-BO')}
          </Typography>
        ),
      },
      {
        accessorKey: 'balance',
        header: 'Balance',
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <Typography color="primary.light" variant="body2" sx={{ fontWeight: 850 }}>
            {formatCurrency(getValue<number>())}
          </Typography>
        ),
      },
      {
        accessorKey: 'isRollover',
        header: 'Rollover',
        filterFn: 'equals',
        meta: {
          filterOptions: rolloverFilterOptions,
          filterVariant: 'select',
        },
        cell: ({ getValue }) => {
          const isRollover = getValue<boolean>();

          return (
            <StatusPill
              label={isRollover ? 'Si' : 'No'}
              pulse={isRollover}
              tone={isRollover ? 'warning' : 'aqua'}
            />
          );
        },
      },
      // {
      //   accessorFn: (row) => row.invoice?.status ?? 'SIN_FACTURA',
      //   id: 'invoice',
      //   header: 'Factura',
      //   filterFn: 'equals',
      //   meta: {
      //     filterOptions: [
      //       { label: 'Pendiente', value: 'PENDING' },
      //       { label: 'Pagada', value: 'PAID' },
      //       { label: 'Cancelada', value: 'CANCELLED' },
      //       { label: 'Sin factura', value: 'SIN_FACTURA' },
      //     ],
      //     filterVariant: 'select',
      //   },
      //   cell: ({ row }) => {
      //     const status = row.original.invoice?.status;

      //     if (!status) {
      //       return <StatusPill label="Sin factura" tone="purple" />;
      //     }

      //     return (
      //       <StatusPill
      //         label={status === 'PAID' ? 'Pagada' : status === 'CANCELLED' ? 'Cancelada' : 'Pendiente'}
      //         pulse={status === 'PENDING'}
      //         tone={status === 'PAID' ? 'success' : status === 'CANCELLED' ? 'error' : 'warning'}
      //       />
      //     );
      //   },
      // },
      {
        id: 'actions',
        header: 'Acciones',
        enableColumnFilter: false,
        enableGlobalFilter: false,
        meta: { align: 'right' },
        cell: ({ row }) => (
          <Stack direction="row" spacing={0.75} sx={{ justifyContent: 'flex-end' }}>
            <Tooltip title="Editar">
              <IconButton color="primary" onClick={() => handleEdit(row.original)} size="small">
                <EditRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton color="error" onClick={() => setDeleteReading(row.original)} size="small">
                <DeleteRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [handleEdit],
  );

  const subtitle = readingsQuery.isLoading
    ? 'Cargando lecturas...'
    : `${(readingsQuery.data?.meta.total ?? readings.length).toLocaleString()} lecturas en backend`;

  return (
    <Stack spacing={2.5}>
      {readingsQuery.isError ? (
        <Alert severity="error">
          {getApiErrorMessage(readingsQuery.error, 'No se pudieron cargar lecturas')}
        </Alert>
      ) : null}

      <DataTable<ReadingWithMeterAndUser>
        ariaLabel="tabla de lecturas"
        columns={columns}
        data={readings}
        emptyMessage={
          readingsQuery.isLoading ? 'Cargando lecturas...' : 'No hay lecturas para mostrar.'
        }
        initialPageSize={10}
        rowsLabel="lecturas"
        rowsPerPageOptions={[10, 25, 50, 100]}
        searchPlaceholder="Buscar por socio, CI o medidor..."
        subtitle={subtitle}
        title="Lecturas"
        toolbarRight={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              disabled={readingsQuery.isFetching}
              onClick={() => void readingsQuery.refetch()}
              startIcon={<RefreshRounded />}
              variant="outlined"
            >
              Refrescar
            </Button>
            <Button onClick={handleCreate} startIcon={<AddRounded />} variant="contained">
              Nueva lectura
            </Button>
          </Stack>
        }
      />

      <ReadingFormDialog onClose={handleCloseForm} open={formOpen} reading={formReading} />
      <DeleteReadingDialog
        onClose={() => setDeleteReading(null)}
        open={Boolean(deleteReading)}
        reading={deleteReading}
      />
    </Stack>
  );
}
