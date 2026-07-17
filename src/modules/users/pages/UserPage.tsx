import { useCallback, useMemo, useState } from 'react';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { ColumnDef, FilterFn } from '@tanstack/react-table';

// MUI ICONS
import AddRounded from '@mui/icons-material/AddRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';

import DataTable from 'components/MainTable/DataTable';
import DeleteUserDialog from 'modules/users/components/DeleteUserDialog';
import UserFormDialog from 'modules/users/components/UserFormDialog';
import { useUsers } from 'modules/users/hooks/useUsers';
import type { User, UsersListParams, UserWithRolesAndMeters } from 'modules/users/types/user.types';
import { RoleName } from 'modules/roles/types/role.types';
import StatusPill from 'shared/ui/aqua/StatusPill';
import type { StatusTone } from 'shared/ui/aqua/StatusPill';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

const normalizeRoleName = (role: string) => role.toUpperCase().replace('TECHNICAL', 'TECHNICIAN');

const statusFilterOptions = [
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false },
];

const roleFilterOptions = RoleName.options.map((option) => ({
  label: option.label,
  value: option.value,
}));

const roleToneByName: Record<string, StatusTone> = {
  ADMIN: 'purple',
  READER: 'success',
  TECHNICIAN: 'warning',
  USER: 'aqua',
};

const userHasRoleFilter: FilterFn<UserWithRolesAndMeters> = (row, _columnId, filterValue) => {
  if (!filterValue) {
    return true;
  }

  return row.original.roles.some((role) => normalizeRoleName(role.name) === filterValue);
};

const getUserInitials = (user: UserWithRolesAndMeters) => {
  const first = user.name.at(0) ?? '';
  const second = user.surname.at(0) ?? '';

  return `${first}${second}`.toUpperCase();
};

export default function UserPage() {
  const [formUser, setFormUser] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const usersParams = useMemo<UsersListParams>(
    () => ({
      limit: 100,
      page: 1,
      sortBy: [{ order: 'desc', whom: 'createdAt' }],
      ci: '',
      q: '',
      roleName: undefined,
      status: undefined,
      withDeleted: false,
    }),
    [],
  );
  const usersQuery = useUsers(usersParams);
  const users = usersQuery.data?.items ?? [];

  const handleCreate = useCallback(() => {
    setFormUser(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((user: User) => {
    setFormUser(user);
    setFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setFormUser(null);
  }, []);

  const columns = useMemo<ColumnDef<UserWithRolesAndMeters, unknown>[]>(
    () => [
      {
        accessorFn: (row) => `${row.name} ${row.surname} ${row.email ?? ''}`,
        id: 'user',
        header: 'Usuario',
        meta: { filterVariant: 'text' },
        cell: ({ row }) => {
          const user = row.original;

          return (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Avatar
                alt={`${user.name} ${user.surname}`}
                src={user.profileImg}
                sx={{
                  width: 42,
                  height: 42,
                  border: '1px solid rgba(34, 211, 238, 0.30)',
                  bgcolor: 'rgba(6, 182, 212, 0.16)',
                  color: 'primary.light',
                  fontWeight: 900,
                }}
              >
                {getUserInitials(user)}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap variant="body2" sx={{ fontWeight: 850 }}>
                  {user.name} {user.surname}
                </Typography>
                <Typography noWrap variant="caption" color="primary.light">
                  {user.email ?? 'Sin correo'}
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
            color="primary.light"
            variant="body2"
            sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace', fontWeight: 800 }}
          >
            {getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorFn: (row) => row.roles.map((role) => normalizeRoleName(role.name)).join(', '),
        id: 'roles',
        header: 'Roles',
        filterFn: userHasRoleFilter,
        meta: {
          filterOptions: roleFilterOptions,
          filterVariant: 'select',
        },
        cell: ({ row }) => (
          <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
            {row.original.roles.length > 0 ? (
              row.original.roles.map((role) => {
                const normalizedRole = normalizeRoleName(role.name);

                return (
                  <StatusPill
                    key={role.id}
                    label={RoleName.getLabelSafe(normalizedRole, normalizedRole)}
                    tone={roleToneByName[normalizedRole] ?? 'aqua'}
                  />
                );
              })
            ) : (
              <Typography color="text.secondary" variant="body2">
                Sin roles
              </Typography>
            )}
          </Stack>
        ),
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
          const active = getValue<boolean>();

          return (
            <StatusPill
              label={active ? 'Activo' : 'Inactivo'}
              pulse={active}
              tone={active ? 'success' : 'error'}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.meters.length,
        id: 'meters',
        header: 'Medidores',
        meta: { filterVariant: 'number' },
        cell: ({ getValue }) => (
          <Typography color="primary.light" variant="body2" sx={{ fontWeight: 850 }}>
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
        cell: ({ row }) => (
          <Stack direction="row" spacing={0.75} sx={{ justifyContent: 'flex-end' }}>
            <Tooltip title="Editar">
              <IconButton color="primary" onClick={() => handleEdit(row.original)} size="small">
                <EditRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton color="error" onClick={() => setDeleteUser(row.original)} size="small">
                <DeleteRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [handleEdit],
  );

  const subtitle = usersQuery.isLoading
    ? 'Cargando usuarios...'
    : `${(usersQuery.data?.meta.total ?? users.length).toLocaleString()} usuarios en backend`;

  return (
    <Stack spacing={2.5}>
      {usersQuery.isError ? (
        <Alert severity="error">
          {getApiErrorMessage(usersQuery.error, 'No se pudieron cargar usuarios')}
        </Alert>
      ) : null}

      <DataTable<UserWithRolesAndMeters>
        ariaLabel="tabla de usuarios"
        columns={columns}
        data={users}
        emptyMessage={
          usersQuery.isLoading ? 'Cargando usuarios...' : 'No hay usuarios para mostrar.'
        }
        initialPageSize={10}
        rowsLabel="usuarios"
        rowsPerPageOptions={[10, 25, 50, 100]}
        searchPlaceholder="Buscar por nombre, CI o email..."
        subtitle={subtitle}
        title="Usuarios"
        toolbarRight={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              disabled={usersQuery.isFetching}
              onClick={() => void usersQuery.refetch()}
              startIcon={<RefreshRounded />}
              variant="outlined"
            >
              Refrescar
            </Button>
            <Button onClick={handleCreate} startIcon={<AddRounded />} variant="contained">
              Nuevo usuario
            </Button>
          </Stack>
        }
      />

      <UserFormDialog onClose={handleCloseForm} open={formOpen} user={formUser} />
      <DeleteUserDialog
        onClose={() => setDeleteUser(null)}
        open={Boolean(deleteUser)}
        user={deleteUser}
      />
    </Stack>
  );
}
