import AdminPanelSettingsRounded from '@mui/icons-material/AdminPanelSettingsRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import EngineeringRounded from '@mui/icons-material/EngineeringRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import SpeedRounded from '@mui/icons-material/SpeedRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState, type ReactNode } from 'react';
import DataTable from 'components/MainTable/DataTable';
import RoleFormDialog from 'modules/roles/components/RoleFormDialog';
import { useRoles, useTotalUsersByRole } from 'modules/roles/hooks/useRoles';
import { RoleName, type Role } from 'modules/roles/types/role.types';
import StatusPill from 'shared/ui/aqua/StatusPill';
import MetricCard, { type MetricTone } from 'shared/ui/aqua/MetricCard';
import { formateDate } from 'shared/utils/formatters';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

const roleFilterOptions = RoleName.options.map((option) => ({
  label: option.label,
  value: option.value,
}));

const ROLE_ICONS: Record<string, ReactNode> = {
  ADMIN: <AdminPanelSettingsRounded />,
  USER: <PersonRounded />,
  TECHNICIAN: <EngineeringRounded />,
  READER: <SpeedRounded />,
};

const ROLE_TONES: Record<string, MetricTone> = {
  ADMIN: 'purple',
  USER: 'aqua',
  TECHNICIAN: 'warning',
  READER: 'success',
};

export default function RolePage() {
  const [formRole, setFormRole] = useState<Role | null>(null);
  const rolesQuery = useRoles();
  const usersCountQuery = useTotalUsersByRole();
  const roles = rolesQuery.data?.items ?? [];
  const usersCountData = usersCountQuery.data?.items ?? [];
  const totalUsers = usersCountData.reduce((acc, curr) => acc + curr.usersCount, 0);

  const columns = useMemo<ColumnDef<Role, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Rol',
        meta: { filterVariant: 'select', filterOptions: roleFilterOptions },
        cell: ({ row }) => (
          <Stack spacing={0.25}>
            <Typography variant="body2" sx={{ fontWeight: 850 }}>
              {RoleName.getLabelSafe(row.original.name, row.original.name)}
            </Typography>
            <Typography color="text.secondary" variant="caption">
              {row.original.name}
            </Typography>
          </Stack>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Descripcion',
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <Typography variant="body2" sx={{ maxWidth: 520 }}>
            {getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        filterFn: 'equals',
        meta: {
          filterVariant: 'select',
          filterOptions: [
            { label: 'Activo', value: true },
            { label: 'Inactivo', value: false },
          ],
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
        accessorKey: 'updatedAt',
        header: 'Actualizado',
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <Typography color="text.secondary" variant="body2">
            {formateDate(getValue<string>(), 'DD MMM YYYY HH:mm')}
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
            <Tooltip title="Editar descripcion">
              <IconButton color="primary" onClick={() => setFormRole(row.original)} size="small">
                <EditRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [],
  );

  const subtitle = rolesQuery.isLoading
    ? 'Cargando roles...'
    : `${roles.length.toLocaleString()} roles definidos en backend`;

  return (
    <Stack spacing={2.5}>
      {rolesQuery.isError ? (
        <Alert severity="error">
          {getApiErrorMessage(rolesQuery.error, 'No se pudieron cargar roles')}
        </Alert>
      ) : null}
      
      {usersCountQuery.isError ? (
        <Alert severity="error">
          {getApiErrorMessage(usersCountQuery.error, 'No se pudieron cargar estadisticas')}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {usersCountData.map((roleStat) => {
          const tone = ROLE_TONES[roleStat.name] || 'aqua';
          const icon = ROLE_ICONS[roleStat.name] || <PersonRounded />;
          const waterLevel = totalUsers > 0 ? Math.round((roleStat.usersCount / totalUsers) * 100) : 0;
          const labelName = RoleName.getLabelSafe(roleStat.name, roleStat.name);

          return (
            <MetricCard
              key={roleStat.id}
              change={`${waterLevel}%`}
              icon={icon}
              label={`Usuarios (${labelName})`}
              tone={tone}
              value={roleStat.usersCount.toLocaleString()}
              waterLevel={waterLevel}
            />
          );
        })}
      </Box>

      <DataTable<Role>
        ariaLabel="tabla de roles"
        columns={columns}
        data={roles}
        emptyMessage={rolesQuery.isLoading ? 'Cargando roles...' : 'No hay roles para mostrar.'}
        initialPageSize={10}
        rowsLabel="roles"
        searchPlaceholder="Buscar por nombre o descripcion..."
        subtitle={subtitle}
        title="Roles"
        toolbarRight={
          <Button
            disabled={rolesQuery.isFetching}
            onClick={() => void rolesQuery.refetch()}
            startIcon={<RefreshRounded />}
            variant="outlined"
          >
            Refrescar
          </Button>
        }
      />

      <RoleFormDialog onClose={() => setFormRole(null)} open={Boolean(formRole)} role={formRole} />
    </Stack>
  );
}
