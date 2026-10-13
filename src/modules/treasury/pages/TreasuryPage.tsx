import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { ColumnDef } from '@tanstack/react-table';

// MUI ICONS
import AccountBalanceWalletRounded from '@mui/icons-material/AccountBalanceWalletRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import ArrowDownwardRounded from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRounded from '@mui/icons-material/ArrowUpwardRounded';
import CompareArrowsRounded from '@mui/icons-material/CompareArrowsRounded';

import DataTableServerSide from 'components/MainTableServerSide/DataTableServerSide';
import type { DataTableServerSide as ServerSideConfig } from 'components/MainTableServerSide/DataTableServerSide';
import TreasuryAdjustmentDialog from 'modules/treasury/components/TreasuryAdjustmentDialog';
import {
  useTreasuryBalance,
  useTreasuryMovements,
  useTreasurySummary,
} from 'modules/treasury/hooks/useTreasury';
import type {
  TreasuryListParams,
  TreasuryMovement,
  TreasuryMovementType,
  TreasuryReferenceType,
} from 'modules/treasury/types/treasury.types';
import type { User } from 'modules/users/types/user.types';
import { useDebounce } from 'shared/hooks/useDebounce';
import { useTableServerSide } from 'shared/hooks/useTableServerSide';
import MetricCard from 'shared/ui/aqua/MetricCard';
import StatusPill, { type StatusTone } from 'shared/ui/aqua/StatusPill';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';
import { formatCurrency, formateDate } from 'shared/utils/formatters';

export default function TreasuryPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // 1. Table state with custom hook
  const { page, pageSize, search, sortBy, serverSideProps, resetPage } = useTableServerSide(10, [
    { order: 'desc', whom: 'createdAt' },
  ]);

  // 2. Extra column filters
  const [columnFilters, setColumnFilters] = useState<Array<{ id: string; value: unknown }>>([]);

  // 3. Search debounce
  const debouncedSearch = useDebounce(search, 500);

  // Column filter extraction
  const typeFilter = columnFilters.find((f) => f.id === 'type')?.value as TreasuryMovementType | undefined;
  const referenceTypeFilter = columnFilters.find((f) => f.id === 'referenceType')
    ?.value as TreasuryReferenceType | undefined;

  // 4. API parameters
  const treasuryParams = useMemo<TreasuryListParams>(
    () => ({
      limit: pageSize,
      page: page,
      sortBy: sortBy,
      q: debouncedSearch,
      type: typeFilter,
      referenceType: referenceTypeFilter,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      withDeleted: false,
    }),
    [pageSize, page, sortBy, debouncedSearch, typeFilter, referenceTypeFilter, dateFrom, dateTo],
  );

  // 5. API Queries
  const movementsQuery = useTreasuryMovements(treasuryParams);
  const movements = movementsQuery.data?.items ?? [];

  const balanceQuery = useTreasuryBalance();
  const currentBalance = balanceQuery.data?.balance ?? 0;

  const summaryQuery = useTreasurySummary(dateFrom || undefined, dateTo || undefined);
  const summary = summaryQuery.data;

  const totalIncome = summary?.movements.INCOME.total ?? 0;
  const totalExpense = summary?.movements.EXPENSE.total ?? 0;
  const netBalance = summary?.netBalance ?? 0;

  // 6. Water levels calculations for MetricCards
  const totalMovements = totalIncome + totalExpense;
  const incomeLevel = totalMovements > 0 ? Math.round((totalIncome / totalMovements) * 100) : 0;
  const expenseLevel = totalMovements > 0 ? Math.round((totalExpense / totalMovements) * 100) : 0;

  // 7. Table Configuration
  const serverSideConfig: ServerSideConfig = useMemo(
    () => ({
      ...serverSideProps,
      totalRows: movementsQuery.data?.meta?.total ?? 0,
      onColumnFiltersChange: (newFilters) => {
        setColumnFilters(newFilters);
        resetPage();
      },
    }),
    [serverSideProps, movementsQuery.data?.meta?.total, resetPage],
  );

  // 8. Table Columns definitions
  const columns = useMemo<ColumnDef<TreasuryMovement, unknown>[]>(
    () => [
      {
        accessorKey: 'movementDate',
        header: 'Fecha',
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {formateDate(getValue<string>(), 'DD MMM YYYY')}
          </Typography>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Tipo',
        filterFn: 'equals',
        meta: {
          filterVariant: 'select',
          filterOptions: [
            { label: 'Ingreso', value: 'INCOME' },
            { label: 'Egreso', value: 'EXPENSE' },
          ],
        },
        cell: ({ getValue }) => {
          const type = getValue<TreasuryMovementType>();
          const isIncome = type === 'INCOME';

          return (
            <StatusPill
              label={isIncome ? 'Ingreso' : 'Egreso'}
              tone={isIncome ? 'success' : 'error'}
            />
          );
        },
      },
      {
        accessorKey: 'description',
        header: 'Detalle / Concepto',
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <Typography variant="body2" sx={{ maxWidth: 350 }}>
            {getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'referenceType',
        header: 'Origen',
        filterFn: 'equals',
        meta: {
          filterVariant: 'select',
          filterOptions: [
            { label: 'Factura', value: 'INVOICE' },
            { label: 'Gasto', value: 'EXPENSE' },
            { label: 'Ajuste Manual', value: 'ADJUSTMENT' },
            { label: 'Otro', value: 'OTHER' },
          ],
        },
        cell: ({ getValue }) => {
          const refType = getValue<TreasuryReferenceType>();
          const labels: Record<TreasuryReferenceType, string> = {
            INVOICE: 'Factura',
            EXPENSE: 'Gasto',
            ADJUSTMENT: 'Ajuste Manual',
            OTHER: 'Otro',
          };
          const tones: Record<TreasuryReferenceType, StatusTone> = {
            INVOICE: 'aqua',
            EXPENSE: 'warning',
            ADJUSTMENT: 'purple',
            OTHER: 'neutral',
          };

          return (
            <StatusPill
              label={labels[refType] || refType}
              tone={tones[refType] || 'neutral'}
            />
          );
        },
      },
      {
        accessorKey: 'amount',
        header: 'Monto',
        enableColumnFilter: false,
        cell: ({ getValue, row }) => {
          const isIncome = row.original.type === 'INCOME';
          const amount = getValue<number>();

          return (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 800,
                color: isIncome ? 'success.main' : 'error.main',
              }}
            >
              {isIncome ? '+' : '-'} {formatCurrency(amount)}
            </Typography>
          );
        },
      },
      {
        accessorKey: 'balanceAfter',
        header: 'Saldo Resultante',
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 850,
              fontFamily: 'JetBrains Mono, Consolas, monospace',
            }}
          >
            {formatCurrency(getValue<number>())}
          </Typography>
        ),
      },
      {
        accessorKey: 'registeredBy',
        header: 'Registrado Por',
        enableColumnFilter: false,
        cell: ({ getValue, row }) => {
          const user = getValue<User | null | undefined>();
          if (!user) {
            return row.original.referenceType === 'INVOICE' && !row.original.registeredById ? (
              <Typography variant="body2" color="text.secondary">
                Banco (QR)
              </Typography>
            ) : (
              '-'
            );
          }

          return (
            <Typography variant="body2">
              {user.name} {user.surname}
            </Typography>
          );
        },
      },
    ],
    [],
  );

  const isAnyError = movementsQuery.isError || balanceQuery.isError || summaryQuery.isError;
  const errorMsg =
    getApiErrorMessage(movementsQuery.error) ||
    getApiErrorMessage(balanceQuery.error) ||
    getApiErrorMessage(summaryQuery.error) ||
    'No se pudieron cargar los datos de tesorería';

  const subtitle = movementsQuery.isLoading
    ? 'Cargando movimientos...'
    : `${movementsQuery.data?.meta?.total ?? 0} transacciones registradas`;

  return (
    <Stack spacing={2.5}>
      {isAnyError && <Alert severity="error">{errorMsg}</Alert>}

      {/* Metric Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        <MetricCard
          change="Caja General"
          icon={<AccountBalanceWalletRounded />}
          label="Saldo Actual de Caja"
          tone="aqua"
          value={formatCurrency(currentBalance)}
          waterLevel={100}
        />
        <MetricCard
          change={`${summary?.movements.INCOME.count ?? 0} trans.`}
          icon={<ArrowUpwardRounded />}
          label="Total Ingresos (Período)"
          tone="success"
          value={formatCurrency(totalIncome)}
          waterLevel={incomeLevel}
        />
        <MetricCard
          change={`${summary?.movements.EXPENSE.count ?? 0} trans.`}
          icon={<ArrowDownwardRounded />}
          label="Total Egresos (Período)"
          tone="error"
          value={formatCurrency(totalExpense)}
          waterLevel={expenseLevel}
        />
        <MetricCard
          change="Flujo Neto"
          icon={<CompareArrowsRounded />}
          label="Balance Neto (Período)"
          tone={netBalance >= 0 ? 'purple' : 'warning'}
          value={formatCurrency(netBalance)}
          waterLevel={netBalance >= 0 ? 100 : 0}
        />
      </Box>

      {/* Date Filters Panel */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{
          p: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 800, minWidth: 120 }}>
          Rango de Fechas:
        </Typography>
        <DatePicker
          label="Fecha Desde"
          onChange={(value) => setDateFrom(value?.isValid() ? value.format('YYYY-MM-DD') : '')}
          value={dateFrom ? dayjs(dateFrom) : null}
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
            },
          }}
        />
        <DatePicker
          label="Fecha Hasta"
          onChange={(value) => setDateTo(value?.isValid() ? value.format('YYYY-MM-DD') : '')}
          value={dateTo ? dayjs(dateTo) : null}
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
            },
          }}
        />
        {(dateFrom || dateTo) && (
          <Button
            size="small"
            variant="text"
            onClick={() => {
              setDateFrom('');
              setDateTo('');
            }}
          >
            Limpiar Filtros
          </Button>
        )}
      </Stack>

      {/* Movements Table */}
      <DataTableServerSide<TreasuryMovement>
        ariaLabel="tabla de tesorería"
        columns={columns}
        data={movements}
        emptyMessage={
          movementsQuery.isLoading ? 'Cargando movimientos...' : 'No hay movimientos para mostrar.'
        }
        initialPageSize={10}
        rowsLabel="movimientos"
        searchPlaceholder="Buscar por detalle..."
        subtitle={subtitle}
        title="Movimientos de Caja"
        serverSide={serverSideConfig}
        toolbarRight={
          <Button
            onClick={() => setDialogOpen(true)}
            startIcon={<AddRounded />}
            variant="contained"
          >
            Registrar Ajuste
          </Button>
        }
      />

      {/* Manual Adjustment Dialog */}
      <TreasuryAdjustmentDialog onClose={() => setDialogOpen(false)} open={dialogOpen} />
    </Stack>
  );
}
