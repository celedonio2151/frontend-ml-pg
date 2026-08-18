import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';

// MUI ICONS
import AddRounded from '@mui/icons-material/AddRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import SwapHorizRounded from '@mui/icons-material/SwapHorizRounded';

// MUI CORE
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import type { DataTableServerSide as ServerSideConfig } from 'components/MainTableServerSide/DataTableServerSide';
import DataTableServerSide from 'components/MainTableServerSide/DataTableServerSide';
import ChangeOwnerDialog from 'modules/meters/components/ChangeOwnerDialog';
import DeleteMeterDialog from 'modules/meters/components/DeleteMeterDialog';
import MeterFormDialog from 'modules/meters/components/MeterFormDialog';
import { useMeters } from 'modules/meters/hooks/useMeters';
import type { MeterWithUser } from 'modules/meters/types/meter.types';
import { useDebounce } from 'shared/hooks/useDebounce';
import { useTableServerSide } from 'shared/hooks/useTableServerSide';
import StatusPill from 'shared/ui/aqua/StatusPill';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

export default function MeterPage() {
  const [formMeter, setFormMeter] = useState<MeterWithUser | undefined>(undefined);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteMeter, setDeleteMeter] = useState<MeterWithUser | null>(null);
  const [changeOwnerMeter, setChangeOwnerMeter] = useState<MeterWithUser | null>(null);

  // 1. Hook de estado server-side
  const { page, pageSize, search, sortBy, serverSideProps } = useTableServerSide(10, [
    { order: 'asc', whom: 'meterNumber' },
  ]);

  // 2. Debounce para la busqueda
  const debouncedSearch = useDebounce(search, 500);

  // 3. Query con todos los parametros del servidor
  const metersParams = useMemo(
    () => ({
      limit: pageSize,
      page,
      sortBy,
      q: debouncedSearch,
    }),
    [pageSize, page, sortBy, debouncedSearch],
  );

  const metersQuery = useMeters(metersParams);
  const meters = metersQuery.data?.items ?? [];

  // 4. Configuracion serverSide para la tabla
  const serverSideConfig: ServerSideConfig = useMemo(
    () => ({
      ...serverSideProps,
      totalRows: metersQuery.data?.meta?.total ?? 0,
    }),
    [serverSideProps, metersQuery.data?.meta?.total],
  );

  const handleCreate = useCallback(() => {
    setFormMeter(undefined);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((meter: MeterWithUser) => {
    setFormMeter(meter);
    setFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormMeter(undefined);
    setFormOpen(false);
  }, []);

  const columns = useMemo<ColumnDef<MeterWithUser, unknown>[]>(
    () => [
      {
        accessorKey: 'meterNumber',
        header: 'Medidor',
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <Typography color="primary.light" variant="body2" sx={{ fontWeight: 850 }}>
            {`#${getValue<number>()}`}
          </Typography>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        enableColumnFilter: false,
        cell: ({ getValue }) => {
          const isActive = getValue<boolean>();
          return (
            <StatusPill
              label={isActive ? 'Activo' : 'Inactivo'}
              pulse={isActive}
              tone={isActive ? 'success' : 'neutral'}
            />
          );
        },
      },
      {
        accessorFn: (row) => `${row.user?.name ?? ''} ${row.user?.surname ?? ''}`,
        id: 'owner',
        header: 'Propietario',
        enableColumnFilter: false,
        cell: ({ row }) => (
          <Stack spacing={0.25}>
            <Typography noWrap variant="body2" sx={{ fontWeight: 850 }}>
              {row.original.user?.name} {row.original.user?.surname}
            </Typography>
            <Typography
              noWrap
              color="textSecondary"
              variant="caption"
              sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace', fontWeight: 600 }}
            >
              CI {row.original.user?.ci}
            </Typography>
          </Stack>
        ),
      },
      {
        // NOTA: 'lecturaActual' NO VIENE del backend actualmente en MeterWithUser.
        // Se coloca un 0 como placeholder. Para implementarlo real, el backend debe retornar 'currentReading'.
        id: 'currentReading',
        header: 'Lectura Actual',
        enableColumnFilter: false,
        meta: { align: 'right' },
        cell: () => {
          const currentReading = 0; // TODO: row.original.currentReading
          return (
            <Typography
              variant="body2"
              color="primary.light"
              sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace', fontWeight: 800 }}
            >
              {currentReading.toLocaleString('es-BO', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 3,
              })}{' '}
              m³
            </Typography>
          );
        },
      },
      {
        accessorKey: 'maximumCapacity',
        header: 'Capacidad Máx',
        enableColumnFilter: false,
        cell: ({ row }) => {
          const maxCapacity = row.original.maximumCapacity;
          const currentReading = 0; // TODO: row.original.currentReading
          const progress = Math.min((currentReading / maxCapacity) * 100, 100);

          return (
            <Stack spacing={0.5} sx={{ width: 140 }}>
              {/* <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {progress.toFixed(1)}%
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontFamily: 'JetBrains Mono', fontWeight: 700 }}
                >
                  {maxCapacity.toLocaleString('es-BO')}
                </Typography>
              </Stack> */}
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(6, 182, 212, 0.12)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    backgroundColor:
                      progress > 90
                        ? 'error.main'
                        : progress > 75
                          ? 'warning.main'
                          : 'primary.main',
                  },
                }}
              />
            </Stack>
          );
        },
      },
      {
        id: 'actions',
        header: 'Acciones',
        enableColumnFilter: false,
        enableGlobalFilter: false,
        meta: { align: 'right' },
        cell: ({ row }) => (
          <Stack direction="row" spacing={0.75} sx={{ justifyContent: 'flex-end' }}>
            <Tooltip title="Cambiar Propietario">
              <IconButton
                color="secondary"
                onClick={() => setChangeOwnerMeter(row.original)}
                size="small"
              >
                <SwapHorizRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton color="primary" onClick={() => handleEdit(row.original)} size="small">
                <EditRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton color="error" onClick={() => setDeleteMeter(row.original)} size="small">
                <DeleteRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [handleEdit],
  );

  const subtitle = metersQuery.isLoading
    ? 'Cargando medidores...'
    : `${(metersQuery.data?.meta.total ?? meters.length).toLocaleString()} medidores en backend`;

  return (
    <Stack spacing={2.5}>
      {metersQuery.isError ? (
        <Alert severity="error">
          {getApiErrorMessage(metersQuery.error, 'No se pudieron cargar los medidores')}
        </Alert>
      ) : null}

      <DataTableServerSide<MeterWithUser>
        serverSide={serverSideConfig}
        ariaLabel="tabla de medidores"
        columns={columns}
        data={meters}
        emptyMessage={
          metersQuery.isLoading ? 'Cargando medidores...' : 'No hay medidores para mostrar.'
        }
        initialPageSize={10}
        rowsLabel="medidores"
        rowsPerPageOptions={[10, 25, 50, 100]}
        searchPlaceholder="Buscar por número o CI del propietario..."
        subtitle={subtitle}
        title="Medidores"
        toolbarRight={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              disabled={metersQuery.isFetching}
              onClick={() => void metersQuery.refetch()}
              startIcon={<RefreshRounded />}
              variant="outlined"
            >
              Refrescar
            </Button>
            <Button onClick={handleCreate} startIcon={<AddRounded />} variant="contained">
              Nuevo medidor
            </Button>
          </Stack>
        }
      />

      <MeterFormDialog onClose={handleCloseForm} open={formOpen} meter={formMeter} />
      <DeleteMeterDialog
        onClose={() => setDeleteMeter(null)}
        open={Boolean(deleteMeter)}
        meter={deleteMeter}
      />
      <ChangeOwnerDialog
        onClose={() => setChangeOwnerMeter(null)}
        open={Boolean(changeOwnerMeter)}
        meter={changeOwnerMeter}
      />
    </Stack>
  );
}
