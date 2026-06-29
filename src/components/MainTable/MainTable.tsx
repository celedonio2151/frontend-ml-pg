import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import type { ColumnDef, RowData } from '@tanstack/react-table';
import StatusPill from 'shared/ui/aqua/StatusPill';
import type { StatusTone } from 'shared/ui/aqua/StatusPill';
import DataTable from './DataTable';
import type { DataTableFilterOption, DataTableFilterVariant, DataTableProps } from './DataTable';

type DemoUser = {
  avatarUrl: string;
  ci: string;
  email: string;
  id: string;
  meters: number;
  name: string;
  role: 'ADMIN' | 'TECHNICAL' | 'USER';
  status: 'Activo' | 'Inactivo';
};

export type MainTableProps<TData extends RowData = DemoUser> = Omit<
  DataTableProps<TData>,
  'columns' | 'data'
> & {
  columns?: ColumnDef<TData, unknown>[];
  data?: TData[];
};

const demoRows: DemoUser[] = [
  {
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
    ci: '12345678',
    email: 'juan.perez@email.com',
    id: 'user-1',
    meters: 2,
    name: 'Juan Perez Garcia',
    role: 'ADMIN',
    status: 'Activo',
  },
  {
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    ci: '87654321',
    email: 'maria@email.com',
    id: 'user-2',
    meters: 1,
    name: 'Maria Lopez',
    role: 'USER',
    status: 'Activo',
  },
  {
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    ci: '45678912',
    email: 'carlos@email.com',
    id: 'user-3',
    meters: 0,
    name: 'Carlos Ruiz',
    role: 'TECHNICAL',
    status: 'Inactivo',
  },
];

const roleTone: Record<DemoUser['role'], StatusTone> = {
  ADMIN: 'purple',
  TECHNICAL: 'warning',
  USER: 'aqua',
};

const statusTone: Record<DemoUser['status'], StatusTone> = {
  Activo: 'success',
  Inactivo: 'error',
};

const roleFilterOptions = [
  { label: 'ADMIN', value: 'ADMIN' },
  { label: 'TECHNICAL', value: 'TECHNICAL' },
  { label: 'USER', value: 'USER' },
];

const statusFilterOptions = [
  { label: 'Activo', value: 'Activo' },
  { label: 'Inactivo', value: 'Inactivo' },
];

const demoColumns: ColumnDef<DemoUser, unknown>[] = [
  {
    accessorFn: (row) => `${row.name} ${row.email}`,
    id: 'user',
    header: 'Usuario',
    meta: { filterVariant: 'text' },
    cell: ({ row }) => {
      const user = row.original;

      return (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Avatar
            alt={user.name}
            src={user.avatarUrl}
            sx={{
              width: 42,
              height: 42,
              border: '1px solid rgba(34, 211, 238, 0.30)',
              bgcolor: 'rgba(6, 182, 212, 0.10)',
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap variant="body2" sx={{ fontWeight: 800 }}>
              {user.name}
            </Typography>
            <Typography noWrap variant="caption" color="primary.light">
              {user.email}
            </Typography>
          </Box>
        </Stack>
      );
    },
  },
  {
    accessorKey: 'ci',
    header: 'CI',
    meta: { filterVariant: 'text' },
    cell: ({ getValue }) => (
      <Typography
        variant="body2"
        color="primary.light"
        sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace', fontWeight: 700 }}
      >
        {getValue<string>()}
      </Typography>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Roles',
    filterFn: 'equals',
    meta: {
      filterOptions: roleFilterOptions,
      filterVariant: 'select',
    },
    cell: ({ getValue }) => {
      const role = getValue<DemoUser['role']>();

      return <StatusPill label={role} tone={roleTone[role]} />;
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    filterFn: 'equals',
    meta: {
      filterOptions: statusFilterOptions,
      filterVariant: 'select',
    },
    cell: ({ getValue }) => {
      const status = getValue<DemoUser['status']>();

      return <StatusPill label={status} pulse={status === 'Activo'} tone={statusTone[status]} />;
    },
  },
  {
    accessorKey: 'meters',
    header: 'Medidores',
    meta: { filterVariant: 'number' },
    cell: ({ getValue }) => (
      <Typography variant="body2" color="primary.light" sx={{ fontWeight: 800 }}>
        {getValue<number>()}
      </Typography>
    ),
  },
  {
    id: 'actions',
    header: 'Acciones',
    enableColumnFilter: false,
    enableGlobalFilter: false,
    meta: { align: 'right' },
    cell: () => (
      <Stack direction="row" spacing={0.75} sx={{ justifyContent: 'flex-end' }}>
        <Tooltip title="Editar">
          <IconButton color="primary" size="small">
            <EditRounded fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton color="primary" size="small">
            <DeleteRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  },
];

function MainTable<TData extends RowData = DemoUser>({
  columns,
  data,
  rowsLabel = 'usuarios',
  searchPlaceholder = 'Buscar por nombre, CI o email...',
  title = 'Gestion de Usuarios',
  ...props
}: MainTableProps<TData>) {
  return (
    <DataTable<TData>
      columns={(columns ?? demoColumns) as ColumnDef<TData, unknown>[]}
      data={(data ?? demoRows) as TData[]}
      rowsLabel={rowsLabel}
      searchPlaceholder={searchPlaceholder}
      title={title}
      {...props}
    />
  );
}

export default MainTable;
export { DataTable };
export type { DataTableFilterOption, DataTableFilterVariant, DataTableProps };
