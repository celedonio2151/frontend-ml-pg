import React from 'react';
import type { Table as ReactTable } from '@tanstack/react-table';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';

export interface DataTablePaginationProps<TData> {
  table: ReactTable<TData>;
  rowsPerPageOptions?: number[];
  rowsLabel?: string;
  /** Show "All" option in the rows-per-page selector. Default: true. */
  showAllOption?: boolean;
}

/**
 * Modern, aesthetic pagination matching the design language:
 *  - Left: "Mostrando X–Y de Z {rowsLabel}"
 *  - Right: rows-per-page selector + numbered page buttons with
 *           first / prev / next / last icon buttons.
 *
 * Replaces the old `TablePaginationActions` (actions.tsx) entirely.
 */
export function DataTablePagination<TData>(props: DataTablePaginationProps<TData>) {
  const {
    table,
    rowsPerPageOptions = [5, 10, 25, 50],
    rowsLabel = 'registros',
    showAllOption = true,
  } = props;

  const theme = useTheme();
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;

  /* Build the "Mostrando X–Y de Z" range. */
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = pageIndex + 1;
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex >= totalPages - 1;

  /* Build the list of page numbers (with ellipsis) to show. */
  const pages = React.useMemo(
    () => buildPageRange(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number | 'all';
    const size = value === 'all' ? totalRows : Number(value);
    table.setPageSize(size);
  };

  const rowsPerPageValue: number | 'all' =
    pageSize >= totalRows && showAllOption ? 'all' : pageSize;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 2,
        py: 1.5,
        borderTop: (t) => `1px solid ${t.palette.divider}`,
        bgcolor: (t) =>
          theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
      }}
    >
      {/* Summary text — left */}
      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
        Mostrando <strong>{from.toLocaleString()}</strong>–<strong>{to.toLocaleString()}</strong> de{' '}
        <strong>{totalRows.toLocaleString()}</strong> {rowsLabel}
      </Typography>

      {/* Right side: rows-per-page + page buttons */}
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Rows per page selector */}
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Filas:
          </Typography>
          <Select
            size="small"
            value={rowsPerPageValue}
            onChange={handleRowsPerPageChange}
            variant="outlined"
            sx={{
              minWidth: 80,
              height: 32,
              '& .MuiSelect-select': { py: 0.5, px: 1, fontSize: 13 },
            }}
            inputProps={{ 'aria-label': 'filas por página' }}
          >
            {rowsPerPageOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
            {showAllOption && <MenuItem value="all">Todas</MenuItem>}
          </Select>
        </Stack>

        {/* Page navigation */}
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <Tooltip title="Primera página">
            <span>
              <IconButton
                size="small"
                onClick={() => table.setPageIndex(0)}
                disabled={isFirstPage}
                aria-label="primera página"
              >
                <FirstPageIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Página anterior">
            <span>
              <IconButton
                size="small"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="página anterior"
              >
                <KeyboardArrowLeftIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          {/* Numbered page buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mx: 0.5 }}>
            {pages.map((page, idx) =>
              page === '…' ? (
                <Typography
                  key={`ellipsis-${idx}`}
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 0.5, userSelect: 'none' }}
                >
                  …
                </Typography>
              ) : (
                <PageButton
                  key={page}
                  page={page}
                  active={page === currentPage}
                  onClick={() => table.setPageIndex(page - 1)}
                />
              ),
            )}
          </Box>

          <Tooltip title="Página siguiente">
            <span>
              <IconButton
                size="small"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="página siguiente"
              >
                <KeyboardArrowRightIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Última página">
            <span>
              <IconButton
                size="small"
                onClick={() => table.setPageIndex(totalPages - 1)}
                disabled={isLastPage}
                aria-label="última página"
              >
                <LastPageIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Page number button                                                 */
/* ------------------------------------------------------------------ */

function PageButton({
  page,
  active,
  onClick,
}: {
  page: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <IconButton
      size="small"
      onClick={onClick}
      aria-label={`ir a página ${page}`}
      aria-current={active ? 'page' : undefined}
      sx={{
        minWidth: 32,
        height: 32,
        borderRadius: 1,
        px: 1,
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        color: active ? 'primary.contrastText' : 'text.primary',
        bgcolor: active ? 'primary.main' : 'transparent',
        border: (t) =>
          active ? `1px solid ${t.palette.primary.main}` : `1px solid ${t.palette.divider}`,
        '&:hover': {
          bgcolor: active ? 'primary.dark' : 'action.hover',
        },
        '&.Mui-disabled': { opacity: 0.5 },
      }}
    >
      {page}
    </IconButton>
  );
}

/* ------------------------------------------------------------------ */
/*  Page range builder with ellipsis                                   */
/* ------------------------------------------------------------------ */

type PageToken = number | '…';

/**
 * Returns the array of page tokens to display, given the current page
 * and total pages. Always shows first and last page; uses ellipsis when
 * the range is too long.
 *
 * Examples (currentPage / totalPages → output):
 *   1 / 5  → [1, 2, 3, 4, 5]
 *   3 / 10 → [1, '…', 2, 3, 4, '…', 10]
 *   1 / 10 → [1, 2, 3, '…', 10]
 *  10 / 10 → [1, '…', 8, 9, 10]
 */
export function buildPageRange(currentPage: number, totalPages: number): PageToken[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const tokens: PageToken[] = [];
  const first = 1;
  const last = totalPages;

  // Always include first page.
  tokens.push(first);

  const leftSibling = Math.max(currentPage - 1, first + 1);
  const rightSibling = Math.min(currentPage + 1, last - 1);

  // Left ellipsis
  if (leftSibling > first + 1) {
    tokens.push('…');
  } else if (leftSibling === first + 1) {
    tokens.push(first + 1);
  }

  // Middle range (current +/- 1)
  for (let p = leftSibling; p <= rightSibling; p++) {
    if (!tokens.includes(p) && p !== first && p !== last) {
      tokens.push(p);
    }
  }

  // Right ellipsis
  if (rightSibling < last - 1) {
    tokens.push('…');
  } else if (rightSibling === last - 1) {
    tokens.push(last - 1);
  }

  // Always include last page.
  tokens.push(last);

  return tokens;
}
