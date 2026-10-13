/* ExampleUsage.tsx
 *
 * Example consumer of the reusable DataTableServerSide component.
 * Demonstrates how to use the `serverSide` prop to manage state completely
 * from the parent component, simulating a real backend connection.
 */

import DownloadIcon from '@mui/icons-material/Download';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { type ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

import type { SortParam } from 'shared/types/api-reponse';
import type { DataTableServerSide as ServerSideConfig } from './DataTableServerSide';
import DataTableServerSide from './DataTableServerSide';
import { makeData, type Person } from './makeData';

const personStatusFilterOptions = [
  { label: 'Single', value: 'single' },
  { label: 'Relationship', value: 'relationship' },
  { label: 'Complicated', value: 'complicated' },
];

/* ------------------------------------------------------------------ */
/*  Mock Backend                                                      */
/* ------------------------------------------------------------------ */

// Generamos 1000 registros para simular una base de datos grande
const DB_MOCK = makeData(1000);

async function fetchPersonsFromServer(
  page: number,
  pageSize: number,
  search: string,
  sortBy: SortParam[],
  filters: Array<{ id: string; value: unknown }>,
): Promise<{ data: Person[]; total: number }> {
  // Simulamos el retraso de la red
  await new Promise((resolve) => setTimeout(resolve, 500));

  let result = [...DB_MOCK];

  // 1. Filtrado Global (Search)
  if (search) {
    const lowerSearch = search.toLowerCase();
    result = result.filter(
      (person) =>
        person.firstName.toLowerCase().includes(lowerSearch) ||
        person.lastName.toLowerCase().includes(lowerSearch),
    );
  }

  // 2. Filtrado por Columnas
  filters.forEach((filter) => {
    if (filter.id === 'status' && filter.value) {
      result = result.filter((p) => p.status === filter.value);
    }
    if (filter.id === 'age' && Array.isArray(filter.value)) {
      const [min, max] = filter.value as [number | undefined, number | undefined];
      if (min !== undefined) result = result.filter((p) => p.age >= min);
      if (max !== undefined) result = result.filter((p) => p.age <= max);
    }
  });

  // 3. Ordenamiento
  if (sortBy.length > 0) {
    const { whom, order } = sortBy[0]; // Solo manejamos 1 nivel de sort para el mock
    result.sort((a, b) => {
      const valA = a[whom as keyof Person];
      const valB = b[whom as keyof Person];
      if (!valA || !valB) return 0;
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // 4. Paginación
  const total = result.length;
  const start = (page - 1) * pageSize;
  const paginatedData = result.slice(start, start + pageSize);

  return { data: paginatedData, total };
}

/* ------------------------------------------------------------------ */
/*  Componente Principal                                              */
/* ------------------------------------------------------------------ */

export default function ExampleUsage() {
  // Estados para la data
  const [data, setData] = useState<Person[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  // Estados controlados para el Server-Side
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortParam[]>([]);
  const [columnFilters, setColumnFilters] = useState<Array<{ id: string; value: unknown }>>([]);

  // Fetch data cuando cambia cualquier estado relevante
  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    fetchPersonsFromServer(page, pageSize, search, sortBy, columnFilters).then((response) => {
      if (active) {
        setData(response.data);
        setTotalRows(response.total);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [page, pageSize, search, sortBy, columnFilters]);

  // Configuración de columnas tipadas
  const columns = useMemo<ColumnDef<Person, unknown>[]>(
    () => [
      {
        header: 'Nombre Completo',
        columns: [
          {
            accessorKey: 'firstName',
            header: 'Nombre',
            cell: (info) => info.getValue(),
          },
          {
            accessorKey: 'lastName',
            header: 'Apellido',
            cell: (info) => info.getValue(),
          },
        ],
      },
      {
        header: 'Información',
        columns: [
          {
            accessorKey: 'age',
            header: 'Edad',
            meta: { filterVariant: 'number' },
          },
          {
            accessorKey: 'visits',
            header: 'Visitas',
            meta: { filterVariant: 'number' },
          },
          {
            accessorKey: 'status',
            header: 'Estado',
            meta: {
              filterOptions: personStatusFilterOptions,
              filterVariant: 'select',
            },
          },
          {
            accessorKey: 'progress',
            header: 'Progreso',
            cell: (info) => `${info.getValue()}%`,
            meta: { filterVariant: 'number' },
          },
        ],
      },
    ],
    [],
  );

  // Configuración de la prop serverSide
  const serverSideConfig: ServerSideConfig = useMemo(
    () => ({
      totalRows,
      page,
      pageSize,
      search,
      sortBy,
      onPageChange: (newPage, newPageSize) => {
        setPage(newPage);
        setPageSize(newPageSize);
      },
      onSearchChange: (newSearch) => {
        setSearch(newSearch);
        setPage(1); // Reset page on search
      },
      onSortChange: (newSortBy) => {
        setSortBy(newSortBy);
        setPage(1);
      },
      onColumnFiltersChange: (newFilters) => {
        setColumnFilters(newFilters);
        setPage(1);
      },
    }),
    [totalRows, page, pageSize, search, sortBy],
  );

  return (
    <Box sx={{ position: 'relative' }}>
      <DataTableServerSide<Person>
        data={data}
        columns={columns}
        serverSide={serverSideConfig}
        // UI props
        rowsPerPageOptions={[5, 10, 25, 50]}
        rowsLabel="personas"
        ariaLabel="tabla de personas server-side"
        title="Tabla Server-Side"
        subtitle="Simulación de peticiones asíncronas con paginación, filtros y ordenamiento"
        enableColumnFilters={true}
        enableGlobalFilter={true}
        showTitle={true}
        showToolbar={true}
        toolbarRight={
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={() => alert('Exportar...')}
          >
            Exportar
          </Button>
        }
      />
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.4)',
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
