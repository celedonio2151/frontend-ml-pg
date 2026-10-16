import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import type { SxProps, Theme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type Table as ReactTable,
  type RowData,
  type SortingState,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { SortParam } from 'shared/types/api-reponse';
import { dataTableStyles } from './DataTable.styles';
import { DataTablePagination } from './DataTablePagination';

export type DataTableFilterOption = {
  label: string;
  value: boolean | number | string;
};

export type DataTableFilterVariant = 'number' | 'select' | 'text';

declare module '@tanstack/react-table' {
  // TanStack Table requires this generic shape when augmenting ColumnMeta.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'center' | 'left' | 'right';
    filterOptions?: DataTableFilterOption[];
    filterVariant?: DataTableFilterVariant;
  }
}

export type DataTableProps<TData extends RowData> = {
  ariaLabel?: string;
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  dense?: boolean;
  emptyMessage?: string;
  enableColumnFilters?: boolean;
  enableGlobalFilter?: boolean;
  initialPageSize?: number;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pagination?: PaginationState;
  rowsLabel?: string;
  rowsPerPageOptions?: number[];
  searchPlaceholder?: string;
  showAllRowsOption?: boolean;
  showTitle?: boolean;
  showToolbar?: boolean;
  stickyHeader?: boolean;
  subtitle?: ReactNode;
  sx?: SxProps<Theme>;
  title?: ReactNode;
  toolbarRight?: ReactNode;
  serverSide?: DataTableServerSide;
};

type ColumnFilterProps<TData extends RowData> = {
  column: Column<TData, unknown>;
  table: ReactTable<TData>;
};

function getColumnLabel<TData extends RowData>(column: Column<TData, unknown>) {
  const header = column.columnDef.header;

  return typeof header === 'string' ? header : column.id;
}

function isNumberColumn<TData extends RowData>(
  column: Column<TData, unknown>,
  table: ReactTable<TData>,
) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  return typeof firstValue === 'number';
}

function getFilterOptionKey(value: DataTableFilterOption['value']) {
  return `${typeof value}:${String(value)}`;
}

function ColumnFilter<TData extends RowData>({ column, table }: ColumnFilterProps<TData>) {
  const columnFilterValue = column.getFilterValue();
  const filterVariant = column.columnDef.meta?.filterVariant;

  if (filterVariant === 'select') {
    const filterOptions = column.columnDef.meta?.filterOptions ?? [];
    const value =
      columnFilterValue === undefined || columnFilterValue === null
        ? ''
        : getFilterOptionKey(columnFilterValue as DataTableFilterOption['value']);

    return (
      <TextField
        fullWidth
        select
        size="small"
        value={value}
        onChange={(event) => {
          const selectedOption = filterOptions.find(
            (option) => getFilterOptionKey(option.value) === event.target.value,
          );

          column.setFilterValue(selectedOption?.value);
        }}
        sx={dataTableStyles.filterInput}
        slotProps={{ htmlInput: { 'aria-label': `Filtrar ${getColumnLabel(column)}` } }}
      >
        <MenuItem value="">Todos</MenuItem>
        {filterOptions.map((option) => (
          <MenuItem key={getFilterOptionKey(option.value)} value={getFilterOptionKey(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  if (filterVariant === 'number' || isNumberColumn(column, table)) {
    const value = (columnFilterValue ?? []) as [
      number | string | undefined,
      number | string | undefined,
    ];

    return (
      <Stack direction="row" spacing={0.75} sx={dataTableStyles.numberFilterGroup}>
        <DebouncedInput
          placeholder="Min"
          size="small"
          type="number"
          value={value[0] ?? ''}
          onChange={(val) =>
            column.setFilterValue(
              (old: [number | string | undefined, number | string | undefined] | undefined) => [
                val === '' ? undefined : Number(val),
                old?.[1],
              ],
            )
          }
          sx={dataTableStyles.filterInput}
          ariaLabel={`Filtrar minimo ${getColumnLabel(column)}`}
        />
        <DebouncedInput
          placeholder="Max"
          size="small"
          type="number"
          value={value[1] ?? ''}
          onChange={(val) =>
            column.setFilterValue(
              (old: [number | string | undefined, number | string | undefined] | undefined) => [
                old?.[0],
                val === '' ? undefined : Number(val),
              ],
            )
          }
          sx={dataTableStyles.filterInput}
          ariaLabel={`Filtrar maximo ${getColumnLabel(column)}`}
        />
      </Stack>
    );
  }

  return (
    <DebouncedInput
      fullWidth
      placeholder={`Buscar ${getColumnLabel(column)}`}
      size="small"
      value={(columnFilterValue ?? '') as string}
      onChange={(val) => column.setFilterValue(val || undefined)}
      sx={dataTableStyles.filterInput}
      ariaLabel={`Filtrar ${getColumnLabel(column)}`}
    />
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ariaLabel,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  ariaLabel?: string;
} & Omit<React.ComponentProps<typeof TextField>, 'onChange' | 'value'>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce]);

  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      slotProps={{
        htmlInput: { 'aria-label': ariaLabel },
        ...props.slotProps,
      }}
    />
  );
}

function GlobalFilter<TData extends RowData>({
  placeholder,
  table,
}: {
  placeholder: string;
  table: ReactTable<TData>;
}) {
  const value = (table.getState().globalFilter ?? '') as string;

  return (
    <DebouncedInput
      placeholder={placeholder}
      size="small"
      value={value}
      onChange={(val) => table.setGlobalFilter(String(val))}
      sx={dataTableStyles.searchField}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="Limpiar busqueda"
                edge="end"
                onClick={() => table.setGlobalFilter('')}
                size="small"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
}

export default function DataTableServerSide<TData extends RowData>({
  ariaLabel = 'tabla de datos',
  columns,
  data,
  dense = false,
  emptyMessage = 'No se encontraron resultados.',
  enableColumnFilters = true,
  enableGlobalFilter = true,
  initialPageSize = 10,
  onPaginationChange,
  pagination: controlledPagination,
  rowsLabel = 'registros',
  rowsPerPageOptions = [5, 10, 25, 50],
  searchPlaceholder = 'Buscar en toda la tabla...',
  showAllRowsOption = true,
  showTitle = true,
  showToolbar = true,
  stickyHeader = true,
  subtitle,
  sx,
  title,
  toolbarRight,
  serverSide,
}: DataTableProps<TData>) {
  const [localColumnFilters, setLocalColumnFilters] = useState<ColumnFiltersState>([]);
  const [localGlobalFilter, setLocalGlobalFilter] = useState('');
  const [localSorting, setLocalSorting] = useState<SortingState>([]);
  const [localPagination, setLocalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // Determine current state based on whether we are using serverSide
  const columnFilters = serverSide?.onColumnFiltersChange ? localColumnFilters : localColumnFilters; // Server-side filters can be locally tracked, just notified
  const globalFilter = serverSide ? serverSide.search : localGlobalFilter;
  const pagination = useMemo(
    () =>
      serverSide
        ? { pageIndex: serverSide.page - 1, pageSize: serverSide.pageSize }
        : (controlledPagination ?? localPagination),
    [serverSide?.page, serverSide?.pageSize, controlledPagination, localPagination],
  );
  const sorting = serverSide
    ? serverSide.sortBy.map((s) => ({ id: s.whom, desc: s.order === 'desc' }))
    : localSorting;

  useEffect(() => {
    if (!enableColumnFilters) {
      setLocalColumnFilters([]);
      if (serverSide?.onColumnFiltersChange) {
        serverSide.onColumnFiltersChange([]);
      }
    }
  }, [enableColumnFilters, serverSide]);

  // Handle Changes
  const handleGlobalFilterChange = useCallback(
    (value: string) => {
      if (serverSide) {
        serverSide.onSearchChange(value);
      } else {
        setLocalGlobalFilter(value);
      }
    },
    [serverSide],
  );

  const handlePaginationChange: OnChangeFn<PaginationState> = useCallback(
    (updater) => {
      const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
      if (serverSide) {
        serverSide.onPageChange(newPagination.pageIndex + 1, newPagination.pageSize);
      } else {
        if (onPaginationChange) {
          onPaginationChange(newPagination);
        } else {
          setLocalPagination(newPagination);
        }
      }
    },
    [pagination, serverSide, onPaginationChange],
  );

  const handleSortingChange: OnChangeFn<SortingState> = useCallback(
    (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      if (serverSide) {
        serverSide.onSortChange(
          newSorting.map((s) => ({ whom: s.id, order: s.desc ? 'desc' : 'asc' })),
        );
      } else {
        setLocalSorting(newSorting);
      }
    },
    [sorting, serverSide],
  );

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = useCallback(
    (updater) => {
      const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
      setLocalColumnFilters(newFilters);
      if (serverSide?.onColumnFiltersChange) {
        serverSide.onColumnFiltersChange(newFilters.map((f) => ({ id: f.id, value: f.value })));
      }
    },
    [columnFilters, serverSide],
  );

  // TanStack Table setup
  const table = useReactTable<TData>({
    columns,
    data,
    enableColumnFilters,
    enableGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: serverSide ? undefined : getFilteredRowModel(),
    getPaginationRowModel: serverSide ? undefined : getPaginationRowModel(),
    getSortedRowModel: serverSide ? undefined : getSortedRowModel(),
    manualPagination: !!serverSide,
    manualFiltering: !!serverSide,
    manualSorting: !!serverSide,
    rowCount: serverSide?.totalRows,
    onColumnFiltersChange: handleColumnFiltersChange,
    onGlobalFilterChange: handleGlobalFilterChange,
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    state: {
      columnFilters,
      globalFilter,
      pagination,
      sorting,
    },
  });

  const filteredCount = serverSide ? serverSide.totalRows : table.getFilteredRowModel().rows.length;
  const toolbarSummary = useMemo(
    () => `${filteredCount.toLocaleString()} ${rowsLabel}`,
    [filteredCount, rowsLabel],
  );
  const shouldShowTitle = showTitle && Boolean(title);

  return (
    <Paper elevation={0} sx={[dataTableStyles.root, ...(Array.isArray(sx) ? sx : [sx])]}>
      {showToolbar ? (
        <Box sx={dataTableStyles.toolbar}>
          <Box sx={dataTableStyles.toolbarLeft}>
            {enableColumnFilters ? (
              <Tooltip title="Cada columna compatible puede filtrar debajo del encabezado.">
                <FilterListIcon color="primary" fontSize="small" />
              </Tooltip>
            ) : null}
            <Box sx={{ minWidth: 0 }}>
              {shouldShowTitle ? <Typography variant="h5">{title}</Typography> : null}
              <Typography variant={shouldShowTitle ? 'body2' : 'body1'} color="text.secondary">
                {subtitle ?? toolbarSummary}
              </Typography>
            </Box>
          </Box>

          <Box sx={dataTableStyles.toolbarRight}>
            {toolbarRight}
            {enableGlobalFilter ? (
              <GlobalFilter placeholder={searchPlaceholder} table={table} />
            ) : null}
          </Box>
        </Box>
      ) : null}

      <TableContainer sx={dataTableStyles.tableContainer}>
        <Table
          aria-label={ariaLabel}
          size={dense ? 'small' : 'medium'}
          stickyHeader={stickyHeader}
          sx={dataTableStyles.table}
        >
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const align = header.column.columnDef.meta?.align ?? 'left';

                  return (
                    <TableCell
                      align={align}
                      colSpan={header.colSpan}
                      key={header.id}
                      sx={dataTableStyles.headerCell}
                    >
                      {header.isPlaceholder ? null : (
                        <Box sx={dataTableStyles.headerContent}>
                          <Box component="span" sx={dataTableStyles.headerLabel}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </Box>
                          {enableColumnFilters && header.column.getCanFilter() ? (
                            <ColumnFilter column={header.column} table={table} />
                          ) : null}
                        </Box>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  align="center"
                  colSpan={table.getVisibleLeafColumns().length}
                  sx={dataTableStyles.emptyCell}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} sx={dataTableStyles.bodyRow}>
                  {row.getVisibleCells().map((cell) => {
                    const align = cell.column.columnDef.meta?.align ?? 'left';

                    return (
                      <TableCell align={align} key={cell.id} sx={dataTableStyles.bodyCell}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <DataTablePagination
        rowsLabel={rowsLabel}
        rowsPerPageOptions={rowsPerPageOptions}
        showAllOption={showAllRowsOption}
        table={table}
      />
    </Paper>
  );
}

/** Configuration for server-side pagination, filtering, and sorting */
export type DataTableServerSide = {
  /** Total number of rows on the server (used for pagination display) */
  totalRows: number;
  /** Current page, 1-based */
  page: number;
  pageSize: number;
  search: string;
  sortBy: SortParam[];
  /** Called when page or page size changes; page is 1-based */
  onPageChange: (page: number, pageSize: number) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sortBy: SortParam[]) => void;
  onColumnFiltersChange?: (filters: Array<{ id: string; value: unknown }>) => void;
};
