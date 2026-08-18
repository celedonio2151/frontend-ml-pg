import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import AddRounded from '@mui/icons-material/AddRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { ColumnDef } from '@tanstack/react-table';

import type { DataTableServerSide as ServerSideConfig } from 'components/MainTableServerSide/DataTableServerSide';
import DataTableServerSide from 'components/MainTableServerSide/DataTableServerSide';
import DeleteReadingDialog from 'modules/readings/components/DeleteReadingDialog';
import ReadingFormDialog from 'modules/readings/components/ReadingFormDialog';
import { useReadings } from 'modules/readings/hooks/useReadings';
import type {
  ReadingWithMeter,
  ReadingWithMeterAndUser,
} from 'modules/readings/types/reading.types';
import paths from 'router/paths';
import { useDebounce } from 'shared/hooks/useDebounce';
import { useTableServerSide } from 'shared/hooks/useTableServerSide';
import StatusPill from 'shared/ui/aqua/StatusPill';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';
import { formatCubicMeters, formatCurrency, formateDate } from 'shared/utils/formatters';

const rolloverFilterOptions = [
  { label: 'Con rollover', value: true },
  { label: 'Sin rollover', value: false },
];

export default function ReadingPage() {
  const navigate = useNavigate();
  const [formReading, setFormReading] = useState<ReadingWithMeter | undefined>(undefined);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteReading, setDeleteReading] = useState<ReadingWithMeterAndUser | null>(null);

  // 1. Hook de estado server-side
  const { page, pageSize, search, sortBy, serverSideProps } = useTableServerSide(10, [
    { order: 'desc', whom: 'date' },
  ]);

  // 2. Debounce para la busqueda
  const debouncedSearch = useDebounce(search, 500);

  // 3. Query con todos los parametros del servidor
  const readingsParams = useMemo(
    () => ({
      limit: pageSize,
      page,
      sortBy,
      q: debouncedSearch,
    }),
    [pageSize, page, sortBy, debouncedSearch],
  );

  const readingsQuery = useReadings(readingsParams);
  const readings = readingsQuery.data?.items ?? [];

  // 4. Configuracion serverSide para la tabla
  const serverSideConfig: ServerSideConfig = useMemo(
    () => ({
      ...serverSideProps,
      totalRows: readingsQuery.data?.meta?.total ?? 0,
    }),
    [serverSideProps, readingsQuery.data?.meta?.total],
  );

  // Handlers
  const handleCreate = useCallback(() => {
    setFormReading(undefined);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((reading: ReadingWithMeter) => {
    setFormReading(reading);
    setFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormReading(undefined);
    setFormOpen(false);
  }, []);

  const handleViewDetail = useCallback(
    (id: string) => {
      void navigate(paths.admin.readingDetail.replace(':id', id));
    },
    [navigate],
  );

  const columns = useMemo<ColumnDef<ReadingWithMeterAndUser, unknown>[]>(
    () => [
      {
        accessorFn: (row) => `${row.ownerName} ${row.ownerSurname} ${row.ownerCi}`,
        id: 'owner',
        header: 'Nombre / CI',
        meta: { filterVariant: 'text' },
        cell: ({ row }) => (
          <Stack spacing={0.25} sx={{ maxWidth: 280 }}>
            <Typography noWrap variant="body2" sx={{ fontWeight: 850 }}>
              {row.original.ownerName} {row.original.ownerSurname}
            </Typography>
            <Typography
              noWrap
              color="textSecondary"
              variant="caption"
              sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace', fontWeight: 600 }}
            >
              CI {row.original.ownerCi}
            </Typography>
          </Stack>
        ),
      },
      {
        accessorFn: (row) => row.meter?.meterNumber ?? row.meterId,
        id: 'meter',
        header: 'N° Medidor',
        enableColumnFilter: false,
        cell: ({ row }) => (
          <Typography color="primary.light" variant="body2" sx={{ fontWeight: 850 }}>
            {`#${row.original.meter?.meterNumber ?? row.original.meterId}`}
          </Typography>
        ),
      },
      {
        accessorKey: 'date',
        header: 'Fecha de lectura',
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <Typography variant="body2" sx={{ fontWeight: 800 }}>
            {formateDate(getValue<string>(), 'DD MMM YYYY HH:mm')}
          </Typography>
        ),
      },
      {
        // Lectura Anterior: beforeMonth.value
        accessorFn: (row) => row.beforeMonth?.value ?? 0,
        id: 'beforeMonth',
        header: 'Lect. Anterior (m³)',
        enableColumnFilter: false,
        meta: { align: 'right' },
        cell: ({ getValue }) => (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace', fontWeight: 700 }}
          >
            {formatCubicMeters(getValue<number>())}
          </Typography>
        ),
      },
      {
        // Lectura Actual: lastMonth.value
        accessorFn: (row) => row.lastMonth?.value ?? 0,
        id: 'lastMonth',
        header: 'Lect. Actual (m³)',
        enableColumnFilter: false,
        meta: { align: 'right' },
        cell: ({ getValue }) => (
          <Typography
            variant="body2"
            color="primary.light"
            sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace', fontWeight: 800 }}
          >
            {formatCubicMeters(getValue<number>())}
          </Typography>
        ),
      },
      {
        // Consumo = diferencia entre actual y anterior
        accessorKey: 'cubicMeters',
        header: 'Consumo (m³)',
        enableColumnFilter: false,
        meta: { align: 'right' },
        cell: ({ getValue }) => (
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              fontWeight: 900,
              color: 'success.main',
            }}
          >
            {formatCubicMeters(getValue<number>())}
          </Typography>
        ),
      },
      {
        accessorKey: 'balance',
        header: 'Balance',
        enableColumnFilter: false,
        meta: { align: 'right' },
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
            <Tooltip title="Ver detalle">
              <IconButton
                color="primary"
                onClick={() => handleViewDetail(row.original.id)}
                size="small"
              >
                <VisibilityRounded fontSize="small" />
              </IconButton>
            </Tooltip>
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
    [handleEdit, handleViewDetail],
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

      <DataTableServerSide<ReadingWithMeterAndUser>
        serverSide={serverSideConfig}
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
