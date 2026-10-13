import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

import AccountCircleRounded from '@mui/icons-material/AccountCircleRounded';
import CalculateRounded from '@mui/icons-material/CalculateRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import SpeedRounded from '@mui/icons-material/SpeedRounded';
import WaterDropRounded from '@mui/icons-material/WaterDropRounded';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import type { ColumnDef } from '@tanstack/react-table';

import BalanceSimulatorCard from 'components/BalanceSimulator/BalanceSimulatorCard';
import DataTable from 'components/MainTable/DataTable';
import EditMyProfileDialog from 'modules/my-account/components/EditMyProfileDialog';
import { useMyMeters, useMyProfile, useMyReadings } from 'modules/my-account/hooks/useMyAccount';
import type { MyMeter, MyReading } from 'modules/my-account/types/my-account.types';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import StatusPill from 'shared/ui/aqua/StatusPill';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';
import { formatCurrency } from 'shared/utils/formatters';

type TabKey = 'perfil' | 'medidores' | 'lecturas' | 'simulador';

function ProfileTab() {
  const profileQuery = useMyProfile();
  const profile = profileQuery.data;
  const [editOpen, setEditOpen] = useState(false);

  if (profileQuery.isLoading) {
    return (
      <Stack sx={{ alignItems: 'center', p: 4 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (profileQuery.isError || !profile) {
    return (
      <Alert severity="error">
        {getApiErrorMessage(profileQuery.error, 'No se pudo cargar tu perfil')}
      </Alert>
    );
  }

  return (
    <AquaPanel liquid sx={{ p: 4 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'center' }}>
        <Avatar src={profile.profileImg} sx={{ width: 84, height: 84, fontSize: 32 }}>
          {profile.name[0]}
        </Avatar>
        <Stack spacing={0.75}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {profile.name} {profile.surname}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            CI: {profile.ci} {profile.email ? `· ${profile.email}` : ''}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mt: 0.5 }}>
            {(profile.roles ?? []).map((role) => (
              <Chip key={role.id} label={role.name} size="small" color="primary" variant="outlined" />
            ))}
            <StatusPill
              label={profile.status ? 'Activo' : 'Inactivo'}
              tone={profile.status ? 'success' : 'error'}
              pulse={profile.status}
            />
          </Stack>
        </Stack>
        <Button
          onClick={() => setEditOpen(true)}
          startIcon={<EditRounded />}
          variant="outlined"
          sx={{ ml: { sm: 'auto' }, alignSelf: { xs: 'stretch', sm: 'center' } }}
        >
          Editar
        </Button>
      </Stack>
      <EditMyProfileDialog onClose={() => setEditOpen(false)} open={editOpen} profile={profile} />
    </AquaPanel>
  );
}

function MyMetersTab() {
  const metersQuery = useMyMeters({ limit: 100 });
  const meters = metersQuery.data?.items ?? [];

  const columns = useMemo<ColumnDef<MyMeter, unknown>[]>(
    () => [
      {
        accessorKey: 'meterNumber',
        header: 'Medidor',
        cell: ({ getValue }) => (
          <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
            #{getValue<number>()}
          </Typography>
        ),
      },
      { accessorKey: 'address', header: 'Dirección', enableColumnFilter: false },
      {
        accessorKey: 'currentValue',
        header: 'Lectura Actual',
        enableColumnFilter: false,
        cell: ({ getValue }) => `${getValue<number>()} m³`,
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        enableColumnFilter: false,
        cell: ({ getValue }) => {
          const active = getValue<boolean>();
          return <StatusPill label={active ? 'Activo' : 'Inactivo'} tone={active ? 'success' : 'error'} />;
        },
      },
    ],
    [],
  );

  return (
    <Stack spacing={2}>
      {metersQuery.isError && (
        <Alert severity="error">
          {getApiErrorMessage(metersQuery.error, 'No se pudieron cargar tus medidores')}
        </Alert>
      )}
      <DataTable<MyMeter>
        ariaLabel="mis medidores"
        columns={columns}
        data={meters}
        emptyMessage={metersQuery.isLoading ? 'Cargando...' : 'No tienes medidores registrados a tu nombre.'}
        initialPageSize={10}
        rowsLabel="medidores"
        searchPlaceholder="Buscar por número de medidor..."
        subtitle={`${meters.length} medidor(es) a tu nombre`}
        title="Mis Medidores"
      />
    </Stack>
  );
}

function MyReadingsTab() {
  const readingsQuery = useMyReadings({ limit: 100 });
  const readings = readingsQuery.data?.items ?? [];

  const columns = useMemo<ColumnDef<MyReading, unknown>[]>(
    () => [
      {
        accessorKey: 'date',
        header: 'Fecha',
        cell: ({ getValue }) => dayjs(getValue<string>()).format('DD MMM YYYY'),
      },
      {
        accessorFn: (row) => row.meter.meterNumber,
        id: 'meter',
        header: 'Medidor',
        enableColumnFilter: false,
        cell: ({ row }) => `#${row.original.meter.meterNumber}`,
      },
      {
        accessorKey: 'cubicMeters',
        header: 'Consumo',
        enableColumnFilter: false,
        cell: ({ getValue }) => `${getValue<number>()} m³`,
      },
      {
        accessorKey: 'balance',
        header: 'Monto',
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {formatCurrency(getValue<number>())}
          </Typography>
        ),
      },
    ],
    [],
  );

  return (
    <Stack spacing={2}>
      {readingsQuery.isError && (
        <Alert severity="error">
          {getApiErrorMessage(readingsQuery.error, 'No se pudieron cargar tus lecturas')}
        </Alert>
      )}
      <DataTable<MyReading>
        ariaLabel="mis lecturas"
        columns={columns}
        data={readings}
        emptyMessage={readingsQuery.isLoading ? 'Cargando...' : 'No tienes lecturas registradas.'}
        initialPageSize={10}
        rowsLabel="lecturas"
        searchPlaceholder="Buscar por descripción..."
        subtitle={`${readings.length} lectura(s) registradas`}
        title="Mis Lecturas"
      />
    </Stack>
  );
}

function BalanceSimulatorTab() {
  return (
    <AquaPanel liquid sx={{ p: 4 }}>
      <BalanceSimulatorCard />
    </AquaPanel>
  );
}

export default function MyAccountPage() {
  const [tab, setTab] = useState<TabKey>('perfil');

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <AccountCircleRounded color="primary" fontSize="large" />
        <Stack>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Mi Cuenta
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tus datos personales: perfil, medidores y lecturas propias. Esto es independiente de los
            módulos de administración.
          </Typography>
        </Stack>
      </Stack>

      <Tabs value={tab} onChange={(_, value: TabKey) => setTab(value)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab icon={<AccountCircleRounded fontSize="small" />} iconPosition="start" label="Perfil" value="perfil" />
        <Tab icon={<SpeedRounded fontSize="small" />} iconPosition="start" label="Mis Medidores" value="medidores" />
        <Tab icon={<WaterDropRounded fontSize="small" />} iconPosition="start" label="Mis Lecturas" value="lecturas" />
        <Tab icon={<CalculateRounded fontSize="small" />} iconPosition="start" label="Simulador" value="simulador" />
      </Tabs>

      {tab === 'perfil' && <ProfileTab />}
      {tab === 'medidores' && <MyMetersTab />}
      {tab === 'lecturas' && <MyReadingsTab />}
      {tab === 'simulador' && <BalanceSimulatorTab />}
    </Stack>
  );
}
