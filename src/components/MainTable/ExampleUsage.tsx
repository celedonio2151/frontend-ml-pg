/* ExampleUsage.tsx
 *
 * Example consumer of the reusable, strongly-typed DataTable.
 * Demonstrates: column filters + global filter + aesthetic pagination.
 */

import React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';

import { DataTable } from './DataTable';
import { makeData, type Person } from './makeData';

const personStatusFilterOptions = [
  { label: 'Single', value: 'single' },
  { label: 'Relationship', value: 'relationship' },
  { label: 'Complicated', value: 'complicated' },
];

export default function ExampleUsage() {
  const data = React.useMemo<Person[]>(() => makeData(10_000), []);

  /* Strongly-typed column definitions. */
  const columns = React.useMemo<ColumnDef<Person, unknown>[]>(
    () => [
      {
        header: 'Nombre',
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: 'firstName',
            header: 'Nombre',
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.lastName,
            id: 'lastName',
            header: 'Apellido',
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: 'Información',
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: 'age',
            header: 'Edad',
            meta: { filterVariant: 'number' },
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'visits',
            header: 'Visitas',
            meta: { filterVariant: 'number' },
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'status',
            header: 'Estado',
            filterFn: 'equals',
            meta: {
              filterOptions: personStatusFilterOptions,
              filterVariant: 'select',
            },
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'progress',
            header: 'Progreso',
            cell: (info) => `${info.getValue()}%`,
            meta: { filterVariant: 'number' },
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
    [],
  );

  return (
    <DataTable<Person>
      data={data}
      columns={columns}
      initialPageSize={10}
      rowsPerPageOptions={[5, 10, 25, 50]}
      rowsLabel="usuarios"
      ariaLabel="tabla de personas"
      title="Prueba de rendimiento"
      subtitle={`${data.length.toLocaleString()} usuarios generados localmente`}
      enableColumnFilters={true}
      enableGlobalFilter={true}
      showTitle={true}
      showToolbar={true}
      toolbarRight={
        <Button
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={() => alert('Exportar…')}
        >
          Exportar
        </Button>
      }
    />
  );
}
