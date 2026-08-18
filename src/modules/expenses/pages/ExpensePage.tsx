import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { ColumnDef } from '@tanstack/react-table';

// MUI ICONS
import AddRounded from '@mui/icons-material/AddRounded';
import CancelRounded from '@mui/icons-material/CancelRounded';
import CategoryRounded from '@mui/icons-material/CategoryRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import HourglassTopRounded from '@mui/icons-material/HourglassTopRounded';
import PaymentsRounded from '@mui/icons-material/PaymentsRounded';

import type { DataTableServerSide as ServerSideConfig } from 'components/MainTableServerSide/DataTableServerSide';
import DataTableServerSide from 'components/MainTableServerSide/DataTableServerSide';
import ExpenseFormDialog from 'modules/expenses/components/ExpenseFormDialog';
import RejectExpenseDialog from 'modules/expenses/components/RejectExpenseDialog';
import {
  useApproveExpenseMutation,
  useDeleteExpenseMutation,
  useExpenses,
  useExpensesSummary,
} from 'modules/expenses/hooks/useExpenses';
import {
  ExpenseCategory,
  ExpenseStatus,
  type Expense,
  type ExpenseCategoryType,
  type ExpensesListParams,
  type ExpenseStatusType,
} from 'modules/expenses/types/expense.types';
import { useDebounce } from 'shared/hooks/useDebounce';
import { useTableServerSide } from 'shared/hooks/useTableServerSide';
import MetricCard from 'shared/ui/aqua/MetricCard';
import StatusPill, { type StatusTone } from 'shared/ui/aqua/StatusPill';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';
import { formatCurrency, formateDate } from 'shared/utils/formatters';

const categoryFilterOptions = ExpenseCategory.options.map((option) => ({
  label: option.label,
  value: option.value,
}));

const statusFilterOptions = ExpenseStatus.options.map((option) => ({
  label: option.label,
  value: option.value,
}));

const categoryToneByName: Record<string, StatusTone> = {
  MAINTENANCE: 'warning',
  SUPPLIES: 'aqua',
  SALARIES: 'purple',
  INFRASTRUCTURE: 'success',
  EMERGENCY: 'error',
  SERVICES: 'aqua',
  OTHER: 'neutral',
};

export default function ExpensePage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [rejectExpense, setRejectExpense] = useState<Expense | null>(null);

  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // 1. Hook de tabla server-side
  const { page, pageSize, search, sortBy, serverSideProps, resetPage } = useTableServerSide(10, [
    { order: 'desc', whom: 'createdAt' },
  ]);

  // 2. Filtros de columnas
  const [columnFilters, setColumnFilters] = useState<Array<{ id: string; value: unknown }>>([]);

  // 3. Debounce para búsqueda
  const debouncedSearch = useDebounce(search, 500);

  // Extracción de filtros por columna
  const categoryFilter = columnFilters.find((f) => f.id === 'category')?.value as
    | ExpenseCategoryType
    | undefined;
  const statusFilter = columnFilters.find((f) => f.id === 'status')?.value as
    | ExpenseStatusType
    | undefined;

  // 4. Parámetros de API
  const expensesParams = useMemo<ExpensesListParams>(
    () => ({
      limit: pageSize,
      page: page,
      sortBy: sortBy,
      q: debouncedSearch,
      category: categoryFilter,
      status: statusFilter,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      withDeleted: false,
    }),
    [pageSize, page, sortBy, debouncedSearch, categoryFilter, statusFilter, dateFrom, dateTo],
  );

  // 5. Consultas e Historiales
  const expensesQuery = useExpenses(expensesParams);
  const expenses = expensesQuery.data?.items ?? [];

  const summaryQuery = useExpensesSummary(dateFrom || undefined, dateTo || undefined);
  const summary = summaryQuery.data;

  const approveMutation = useApproveExpenseMutation();
  const deleteMutation = useDeleteExpenseMutation();
  const [actionError, setActionError] = useState<string | null>(null);

  // Totales y estadísticas para MetricCards
  const totalApprovedAmount = summary?.totalAmount ?? 0;
  const pendingCount = expenses.filter(
    (e) => e.status === ExpenseStatus.getLabel('PENDING'),
  ).length;
  const rejectedCount = expenses.filter(
    (e) => e.status === ExpenseStatus.getLabelSafe('REJECTED'),
  ).length;
  const categoriesCount = summary?.categories.length ?? 0;

  // Handlers para diálogos
  const handleCreate = useCallback(() => {
    setSelectedExpense(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((expense: Expense) => {
    setSelectedExpense(expense);
    setFormOpen(true);
  }, []);

  const handleApprove = useCallback(
    async (id: string) => {
      setActionError(null);
      try {
        await approveMutation.mutateAsync(id);
      } catch (err) {
        setActionError(getApiErrorMessage(err, 'No se pudo aprobar el gasto'));
      }
    },
    [approveMutation],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm('¿Está seguro de que desea eliminar este registro de gasto?')) return;
      setActionError(null);
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        setActionError(getApiErrorMessage(err, 'No se pudo eliminar el gasto'));
      }
    },
    [deleteMutation],
  );

  // 6. Configuración de tabla ServerSide
  const serverSideConfig: ServerSideConfig = useMemo(
    () => ({
      ...serverSideProps,
      totalRows: expensesQuery.data?.meta?.total ?? 0,
      onColumnFiltersChange: (newFilters) => {
        setColumnFilters(newFilters);
        resetPage();
      },
    }),
    [serverSideProps, expensesQuery.data?.meta?.total, resetPage],
  );

  // 7. Definición de Columnas
  const columns = useMemo<ColumnDef<Expense, unknown>[]>(
    () => [
      {
        accessorKey: 'expenseDate',
        header: 'Fecha Gasto',
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {formateDate(getValue<string>(), 'DD MMM YYYY')}
          </Typography>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Categoría',
        filterFn: 'equals',
        meta: {
          filterOptions: categoryFilterOptions,
          filterVariant: 'select',
        },
        cell: ({ getValue }) => {
          const category = getValue<ExpenseCategoryType>();
          const label = ExpenseCategory.getLabelSafe(category, category);
          const tone = categoryToneByName[category] ?? 'aqua';

          return <StatusPill label={label} tone={tone} />;
        },
      },
      {
        accessorKey: 'description',
        header: 'Descripción / Recibo',
        enableColumnFilter: false,
        cell: ({ row }) => {
          const expense = row.original;
          return (
            <Stack spacing={0.5}>
              <Typography variant="body2" sx={{ fontWeight: 700, maxWidth: 320 }}>
                {expense.description}
              </Typography>
              {expense.receiptNumber && (
                <Typography variant="caption" color="text.secondary">
                  Recibo: <strong>{expense.receiptNumber}</strong>
                </Typography>
              )}
            </Stack>
          );
        },
      },
      {
        accessorKey: 'amount',
        header: 'Monto',
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 900,
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              color: 'error.light',
            }}
          >
            {formatCurrency(getValue<number>())}
          </Typography>
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
          const status = getValue<ExpenseStatusType>();
          const label = ExpenseStatus.getLabelSafe(status, status);

          const statusProps: Record<ExpenseStatusType, { tone: StatusTone; pulse: boolean }> = {
            PENDING: { tone: 'warning', pulse: true },
            APPROVED: { tone: 'success', pulse: false },
            REJECTED: { tone: 'error', pulse: false },
          };

          const props = statusProps[status] ?? { tone: 'neutral', pulse: false };

          return <StatusPill label={label} pulse={props.pulse} tone={props.tone} />;
        },
      },
      {
        id: 'actions',
        header: 'Acciones',
        enableColumnFilter: false,
        cell: ({ row }) => {
          const expense = row.original;
          const isPending = expense.status === 'PENDING';

          return (
            <Stack direction="row" spacing={0.5}>
              {isPending && (
                <>
                  <Tooltip title="Aprobar gasto (Afecta Tesorería)">
                    <span>
                      <IconButton
                        color="success"
                        disabled={approveMutation.isPending}
                        onClick={() => void handleApprove(expense.id)}
                        size="small"
                      >
                        <CheckCircleRounded fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="Rechazar gasto">
                    <IconButton
                      color="warning"
                      onClick={() => setRejectExpense(expense)}
                      size="small"
                    >
                      <CancelRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Editar gasto">
                    <IconButton color="primary" onClick={() => handleEdit(expense)} size="small">
                      <EditRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              <Tooltip title="Eliminar gasto">
                <span>
                  <IconButton
                    color="error"
                    disabled={deleteMutation.isPending}
                    onClick={() => void handleDelete(expense.id)}
                    size="small"
                  >
                    <DeleteRounded fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          );
        },
      },
    ],
    [approveMutation.isPending, deleteMutation.isPending, handleApprove, handleDelete, handleEdit],
  );

  const isAnyError = expensesQuery.isError || summaryQuery.isError || Boolean(actionError);
  const errorMsg =
    actionError ||
    getApiErrorMessage(expensesQuery.error) ||
    getApiErrorMessage(summaryQuery.error) ||
    'Ocurrió un error al cargar la información de gastos';

  const subtitle = expensesQuery.isLoading
    ? 'Cargando gastos...'
    : `${expensesQuery.data?.meta?.total ?? 0} registros de gastos en total`;

  return (
    <Stack spacing={2.5}>
      {isAnyError && <Alert severity="error">{errorMsg}</Alert>}

      {/* Grid de Tarjetas Degradadas (MetricCards) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        <MetricCard
          change="Aprobados"
          icon={<PaymentsRounded />}
          label="Total Gastado (Aprobado)"
          tone="aqua"
          value={formatCurrency(totalApprovedAmount)}
          waterLevel={100}
        />
        <MetricCard
          change="En espera"
          icon={<HourglassTopRounded />}
          label="Pendientes por Aprobar"
          tone="warning"
          value={`${pendingCount} req.`}
          waterLevel={pendingCount > 0 ? 60 : 0}
        />
        <MetricCard
          change="Rechazados"
          icon={<CancelRounded />}
          label="Gastos Rechazados"
          tone="error"
          value={`${rejectedCount} reg.`}
          waterLevel={rejectedCount > 0 ? 40 : 0}
        />
        <MetricCard
          change="Distribución"
          icon={<CategoryRounded />}
          label="Categorías con Gastos"
          tone="purple"
          value={`${categoriesCount} cat.`}
          waterLevel={80}
        />
      </Box>

      {/* Panel de Filtros por Rango de Fechas */}
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
          slotProps={{
            textField: {
              fullWidth: true,
              size: 'small',
            },
          }}
          value={dateFrom ? dayjs(dateFrom) : null}
        />
        <DatePicker
          label="Fecha Hasta"
          onChange={(value) => setDateTo(value?.isValid() ? value.format('YYYY-MM-DD') : '')}
          slotProps={{
            textField: {
              fullWidth: true,
              size: 'small',
            },
          }}
          value={dateTo ? dayjs(dateTo) : null}
        />
        {(dateFrom || dateTo) && (
          <Button
            onClick={() => {
              setDateFrom('');
              setDateTo('');
            }}
            size="small"
            variant="text"
          >
            Limpiar Filtros
          </Button>
        )}
      </Stack>

      {/* Tabla ServerSide de Gastos */}
      <DataTableServerSide<Expense>
        ariaLabel="tabla de gastos"
        columns={columns}
        data={expenses}
        emptyMessage={
          expensesQuery.isLoading ? 'Cargando gastos...' : 'No hay gastos para mostrar.'
        }
        initialPageSize={10}
        rowsLabel="gastos"
        searchPlaceholder="Buscar por descripción o nº de recibo..."
        serverSide={serverSideConfig}
        subtitle={subtitle}
        title="Gastos Operativos"
        toolbarRight={
          <Button onClick={handleCreate} startIcon={<AddRounded />} variant="contained">
            Nuevo Gasto
          </Button>
        }
      />

      {/* Diálogos de Formulario y Rechazo */}
      <ExpenseFormDialog
        expense={selectedExpense}
        onClose={() => setFormOpen(false)}
        open={formOpen}
      />

      <RejectExpenseDialog
        expense={rejectExpense}
        onClose={() => setRejectExpense(null)}
        open={Boolean(rejectExpense)}
      />
    </Stack>
  );
}
