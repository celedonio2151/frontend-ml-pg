import React from 'react';
import {
  type ColumnDef,
  type Column,
  type Table as ReactTable,
  type PaginationState,
  type OnChangeFn,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';

import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';

import { DataTablePagination } from './DataTablePagination';

/* ------------------------------------------------------------------ */
/*  Public types                                                       */
/* ------------------------------------------------------------------ */

/**
 * Props for the reusable DataTable.
 *
 * `TData` is the row shape — every consumer gets full type-safety for
 * columns, filters and event handlers.
 */
export interface DataTableProps<TData> {
  /** Row collection to render. */
  data: TData[];
  /** Column definitions (TanStack `ColumnDef<TData>[]`). */
  columns: ColumnDef<TData, unknown>[];
  /** Enable / disable the global search box. Default: `true`. */
  enableGlobalFilter?: boolean;
  /** Enable / disable per-column filters. Default: `true`. */
  enableColumnFilters?: boolean;
  /** Initial page size. Default: `10`. */
  initialPageSize?: number;
  /** Optional controlled pagination state. */
  pagination?: PaginationState;
  /** Callback fired when pagination changes (controlled mode). */
  onPaginationChange?: OnChangeFn<PaginationState>;
  /** Rows-per-page options shown in the selector. */
  rowsPerPageOptions?: number[];
  /** Label shown in the summary, e.g. "usuarios". */
  rowsLabel?: string;
  /** Placeholder for the global search input. */
  searchPlaceholder?: string;
  /** Dense rows (smaller padding). Default: `false`. */
  dense?: boolean;
  /** Sticky header. Default: `true`. */
  stickyHeader?: boolean;
  /** Extra toolbar content rendered on the right (e.g. export button). */
  toolbarRight?: React.ReactNode;
  /** ARIA label for the table element. */
  ariaLabel?: string;
  /** Optional className / sx passthrough on the root Box. */
  sx?: object;
}

/* ------------------------------------------------------------------ */
/*  Filter sub-component                                               */
/* ------------------------------------------------------------------ */

interface FilterProps<TData> {
  column: Column<TData, unknown>;
  table: ReactTable<TData>;
}

function ColumnFilter<TData>({ column, table }: FilterProps<TData>) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  /* Numeric range filter — two inputs (min / max). */
  if (typeof firstValue === 'number') {
    const value = (columnFilterValue as [number | string, number | string] | undefined) ?? [
      '',
      '',
    ];
    return (
      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
        <TextField
          size="small"
          type="number"
          value={value[0] ?? ''}
          onChange={(e) =>
            column.setFilterValue((old: [unknown, unknown] | undefined) => [
              e.target.value === '' ? undefined : Number(e.target.value),
              old?.[1],
            ])
          }
          placeholder="Mín"
          variant="outlined"
          sx={filterInputSx}
          inputProps={{ 'aria-label': `Filtrar mínimo ${column.id}` }}
        />
        <TextField
          size="small"
          type="number"
          value={value[1] ?? ''}
          onChange={(e) =>
            column.setFilterValue((old: [unknown, unknown] | undefined) => [
              old?.[0],
              e.target.value === '' ? undefined : Number(e.target.value),
            ])
          }
          placeholder="Máx"
          variant="outlined"
          sx={filterInputSx}
          inputProps={{ 'aria-label': `Filtrar máximo ${column.id}` }}
        />
      </Box>
    );
  }

  /* Text contains filter. */
  return (
    <TextField
      size="small"
      fullWidth
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder="Buscar…"
      variant="outlined"
      sx={{ ...filterInputSx, mt: 0.5 }}
      inputProps={{ 'aria-label': `Filtrar ${column.id}` }}
    />
  );
}

const filterInputSx = {
  '& .MuiOutlinedInput-root': {
    height: 32,
    fontSize: 13,
    bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)'),
  },
  '& .MuiOutlinedInput-input': { py: 0.75, px: 1 },
} as const;

/* ------------------------------------------------------------------ */
/*  Global filter                                                      */
/* ------------------------------------------------------------------ */

function useDebouncedValue<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function GlobalFilter<TData>({ table }: { table: ReactTable<TData> }) {
  const value = (table.getState().globalFilter as string) ?? '';
  const [local, setLocal] = React.useState(value);
  const debounced = useDebouncedValue(local, 200);

  React.useEffect(() => {
    table.setGlobalFilter(debounced);
  }, [debounced, table]);

  return (
    <TextField
      size="small"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      placeholder="Buscar en toda la tabla…"
      sx={{ minWidth: 280 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: local ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              aria-label="Limpiar búsqueda"
              onClick={() => setLocal('')}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function DataTable<TData>(props: DataTableProps<TData>) {
  const {
    data,
    columns,
    enableGlobalFilter = true,
    enableColumnFilters = true,
    initialPageSize = 10,
    pagination: controlledPagination,
    onPaginationChange,
    rowsPerPageOptions = [5, 10, 25, 50],
    rowsLabel = 'registros',
    searchPlaceholder,
    dense = false,
    stickyHeader = true,
    toolbarRight,
    ariaLabel = 'tabla de datos',
    sx,
  } = props;

  /* Internal (uncontrolled) pagination used when caller does not provide one. */
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: initialPageSize,
    });

  const pagination = controlledPagination ?? internalPagination;
  const onPaginationChangeHandled: OnChangeFn<PaginationState> = React.useCallback(
    (updater) => {
      if (onPaginationChange) {
        onPaginationChange(updater);
      } else {
        setInternalPagination(updater);
      }
    },
    [onPaginationChange],
  );

  const table = useReactTable<TData>({
    data,
    columns,
    state: { pagination },
    onPaginationChange: onPaginationChangeHandled,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnFilters,
    enableGlobalFilter: enableGlobalFilter,
    initialState: { pagination: { pageIndex: 0, pageSize: initialPageSize } },
  });

  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: 2,
          py: 1.5,
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          {enableColumnFilters && (
            <Tooltip title="Cada columna con tipo simple soporta su propio filtro debajo del encabezado.">
              <FilterListIcon fontSize="small" color="action" />
            </Tooltip>
          )}
          {searchPlaceholder ?? (
            <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
              {filteredCount.toLocaleString()} {rowsLabel}
            </Box>
          )}
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          {toolbarRight}
          {enableGlobalFilter && <GlobalFilter table={table} />}
        </Stack>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} variant="outlined" square>
        <Table
          size={dense ? 'small' : 'medium'}
          stickyHeader={stickyHeader}
          aria-label={ariaLabel}
        >
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    colSpan={header.colSpan}
                    sx={{
                      verticalAlign: 'top',
                      fontWeight: 600,
                      bgcolor: (t) =>
                        t.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.02)'
                          : 'rgba(0,0,0,0.02)',
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <Box>
                        <Box sx={{ mb: enableColumnFilters ? 0.5 : 0 }}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </Box>
                        {enableColumnFilters && header.column.getCanFilter() ? (
                          <ColumnFilter column={header.column} table={table} />
                        ) : null}
                      </Box>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  align="center"
                  sx={{ py: 6, color: 'text.secondary' }}
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} hover>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Aesthetic pagination */}
      <DataTablePagination
        table={table}
        rowsPerPageOptions={rowsPerPageOptions}
        rowsLabel={rowsLabel}
      />
    </Box>
  );
}

export default DataTable;
