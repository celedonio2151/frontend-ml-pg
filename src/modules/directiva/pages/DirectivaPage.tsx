import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

import AddRounded from '@mui/icons-material/AddRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { ColumnDef } from '@tanstack/react-table';

import type { DataTableServerSide as ServerSideConfig } from 'components/MainTableServerSide/DataTableServerSide';
import DataTableServerSide from 'components/MainTableServerSide/DataTableServerSide';
import DeleteDirectivaDialog from 'modules/directiva/components/DeleteDirectivaDialog';
import DirectivaFormDialog from 'modules/directiva/components/DirectivaFormDialog';
import { useBoardDirectors } from 'modules/directiva/hooks/useDirectiva';
import type { BoardDirector } from 'modules/directiva/types/directiva.types';
import { useDebounce } from 'shared/hooks/useDebounce';
import { useTableServerSide } from 'shared/hooks/useTableServerSide';
import StatusPill from 'shared/ui/aqua/StatusPill';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

export default function DirectivaPage() {
  const [formDirector, setFormDirector] = useState<BoardDirector | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteDirector, setDeleteDirector] = useState<BoardDirector | null>(null);

  const { page, pageSize, search, sortBy, serverSideProps } = useTableServerSide(10, [
    { order: 'asc', whom: 'order' },
  ]);

  const debouncedSearch = useDebounce(search, 500);

  const params = useMemo(
    () => ({
      limit: pageSize,
      page,
      sortBy,
      q: debouncedSearch,
    }),
    [pageSize, page, sortBy, debouncedSearch],
  );

  const directorsQuery = useBoardDirectors(params);
  const directors = directorsQuery.data?.items ?? [];

  const serverSideConfig: ServerSideConfig = useMemo(
    () => ({
      ...serverSideProps,
      totalRows: directorsQuery.data?.meta?.total ?? 0,
    }),
    [serverSideProps, directorsQuery.data?.meta?.total],
  );

  const columns = useMemo<ColumnDef<BoardDirector, unknown>[]>(
    () => [
      {
        accessorKey: 'order',
        header: 'Orden',
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
            #{getValue<number>()}
          </Typography>
        ),
      },
      {
        accessorFn: (row) => `${row.user.name} ${row.user.surname}`,
        id: 'user',
        header: 'Miembro',
        enableColumnFilter: false,
        cell: ({ row }) => (
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
            <Avatar
              alt={`${row.original.user.name} ${row.original.user.surname}`}
              src={row.original.user.profileImg}
              sx={{ width: 32, height: 32 }}
            />
            <Stack spacing={0}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {row.original.user.name} {row.original.user.surname}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                CI: {row.original.user.ci}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        accessorKey: 'positionRole',
        header: 'Cargo',
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {getValue<string>()}
          </Typography>
        ),
      },
      {
        id: 'period',
        header: 'Periodo',
        enableColumnFilter: false,
        cell: ({ row }) => (
          <Typography variant="body2" color="text.secondary">
            {dayjs(row.original.startDate).format('DD MMM YYYY')} —{' '}
            {dayjs(row.original.endDate).format('DD MMM YYYY')}
          </Typography>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        enableColumnFilter: false,
        cell: ({ getValue }) => {
          const active = getValue<boolean>();
          return (
            <StatusPill label={active ? 'Habilitado' : 'Inhabilitado'} pulse={active} tone={active ? 'success' : 'error'} />
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
            <Tooltip title="Editar">
              <IconButton color="primary" onClick={() => setFormDirector(row.original)} size="small">
                <EditRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton color="error" onClick={() => setDeleteDirector(row.original)} size="small">
                <DeleteRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [],
  );

  const subtitle = directorsQuery.isLoading
    ? 'Cargando mesa directiva...'
    : `${directorsQuery.data?.meta?.total ?? directors.length} designaciones registradas`;

  return (
    <Stack spacing={2.5}>
      {directorsQuery.isError ? (
        <Alert severity="error">
          {getApiErrorMessage(directorsQuery.error, 'No se pudo cargar la mesa directiva')}
        </Alert>
      ) : null}

      <DataTableServerSide<BoardDirector>
        serverSide={serverSideConfig}
        ariaLabel="tabla de mesa directiva"
        columns={columns}
        data={directors}
        emptyMessage={
          directorsQuery.isLoading ? 'Cargando designaciones...' : 'No hay designaciones registradas.'
        }
        initialPageSize={10}
        rowsLabel="designaciones"
        rowsPerPageOptions={[10, 25, 50]}
        searchPlaceholder="Buscar por cargo o usuario..."
        subtitle={subtitle}
        title="Mesa Directiva"
        toolbarRight={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              disabled={directorsQuery.isFetching}
              onClick={() => void directorsQuery.refetch()}
              startIcon={<RefreshRounded />}
              variant="outlined"
            >
              Refrescar
            </Button>
            <Button onClick={() => setIsCreateOpen(true)} startIcon={<AddRounded />} variant="contained">
              Nueva designación
            </Button>
          </Stack>
        }
      />

      <DirectivaFormDialog
        boardDirector={formDirector}
        onClose={() => setFormDirector(null)}
        open={Boolean(formDirector)}
      />
      <DirectivaFormDialog boardDirector={null} onClose={() => setIsCreateOpen(false)} open={isCreateOpen} />
      <DeleteDirectivaDialog
        boardDirector={deleteDirector}
        onClose={() => setDeleteDirector(null)}
        open={Boolean(deleteDirector)}
      />
    </Stack>
  );
}
