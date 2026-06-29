# MainTable / DataTable

Tabla reutilizable para vistas administrativas. Esta basada en TanStack Table para el modelo de datos y MUI para la UI, con el estilo aqua del proyecto.

Usa `DataTable` cuando ya tienes tus columnas y datos. Usa `MainTable` solo como wrapper/demo de usuarios, o como punto de partida mientras se conectan modulos reales.

> Importante: el directorio real es `src/components/MainTable`. Mantener esa misma capitalizacion evita problemas de imports entre Windows, Git y builds.

## Archivos

| Archivo | Uso |
| --- | --- |
| `DataTable.tsx` | Componente generico reutilizable. Recibe `columns` y `data`. |
| `DataTable.styles.ts` | Estilos MUI `sx` para mantener la estetica aqua. |
| `DataTablePagination.tsx` | Paginacion personalizada. |
| `MainTable.tsx` | Wrapper con columnas y datos demo de usuarios. |
| `ExampleUsage.tsx` | Ejemplo tipado con 10,000 filas para probar rendimiento. |
| `makeData.ts` | Generador local deterministico para pruebas. |

## Uso basico

```tsx
import DataTable from 'components/MainTable/DataTable';
import type { ColumnDef } from '@tanstack/react-table';

type User = {
  ci: string;
  email: string;
  id: string;
  name: string;
  status: 'Activo' | 'Inactivo';
};

const columns: ColumnDef<User, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Usuario',
    meta: { filterVariant: 'text' },
  },
  {
    accessorKey: 'ci',
    header: 'CI',
    meta: { filterVariant: 'text' },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    filterFn: 'equals',
    meta: {
      filterVariant: 'select',
      filterOptions: [
        { label: 'Activo', value: 'Activo' },
        { label: 'Inactivo', value: 'Inactivo' },
      ],
    },
  },
];

export function UsersPage() {
  return (
    <DataTable<User>
      columns={columns}
      data={users}
      title="Usuarios"
      rowsLabel="usuarios"
      searchPlaceholder="Buscar por nombre, CI o email..."
    />
  );
}
```

## Props principales

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `columns` | `ColumnDef<TData, unknown>[]` | requerido | Columnas tipadas de TanStack Table. |
| `data` | `TData[]` | requerido | Filas de la tabla. |
| `title` | `ReactNode` | - | Titulo mostrado en la toolbar. |
| `subtitle` | `ReactNode` | conteo filtrado | Texto debajo del titulo. |
| `rowsLabel` | `string` | `registros` | Nombre usado en resumen y paginacion. |
| `enableGlobalFilter` | `boolean` | `true` | Muestra/activa busqueda global. |
| `enableColumnFilters` | `boolean` | `true` | Muestra/activa filtros por columna. |
| `showTitle` | `boolean` | `true` | Oculta solo el titulo; mantiene subtitulo y toolbar. |
| `showToolbar` | `boolean` | `true` | Oculta toda la barra superior, incluida busqueda global. |
| `toolbarRight` | `ReactNode` | - | Acciones extra al lado de la busqueda. |
| `initialPageSize` | `number` | `10` | Cantidad inicial de filas por pagina. |
| `rowsPerPageOptions` | `number[]` | `[5, 10, 25, 50]` | Opciones del selector de filas. |
| `showAllRowsOption` | `boolean` | `true` | Agrega la opcion `Todas` en paginacion. |
| `dense` | `boolean` | `false` | Usa tamano compacto de MUI Table. |
| `stickyHeader` | `boolean` | `true` | Mantiene fijo el header cuando el contenedor scrollea. |
| `emptyMessage` | `string` | `No se encontraron resultados.` | Mensaje cuando no hay filas visibles. |
| `pagination` | `PaginationState` | interno | Permite controlar la paginacion desde fuera. |
| `onPaginationChange` | `OnChangeFn<PaginationState>` | interno | Callback para paginacion controlada. |

## Control de toolbar y filtros

```tsx
<DataTable
  columns={columns}
  data={data}
  enableColumnFilters={false}
  enableGlobalFilter={false}
  showTitle={false}
/>
```

Si `enableColumnFilters` o `enableGlobalFilter` cambian a `false`, la tabla limpia esos filtros para que no queden resultados ocultos por un filtro invisible.

Para una tabla sin barra superior:

```tsx
<DataTable columns={columns} data={data} showToolbar={false} />
```

La paginacion sigue visible aunque la toolbar se oculte.

## Filtros por columna

Los filtros se configuran en `column.meta.filterVariant`.

### Texto

```tsx
{
  accessorKey: 'name',
  header: 'Nombre',
  meta: { filterVariant: 'text' },
}
```

### Numerico

El filtro numerico muestra campos `Min` y `Max`.

```tsx
{
  accessorKey: 'meters',
  header: 'Medidores',
  meta: { filterVariant: 'number' },
}
```

### Select para estados conocidos

Usa `filterFn: 'equals'` para comparar el valor exacto. Esto funciona bien con strings, numeros o booleanos.

```tsx
{
  accessorKey: 'status',
  header: 'Estado',
  filterFn: 'equals',
  meta: {
    filterVariant: 'select',
    filterOptions: [
      { label: 'Activo', value: 'Activo' },
      { label: 'Inactivo', value: 'Inactivo' },
    ],
  },
}
```

## Desactivar filtros por columna especifica

```tsx
{
  id: 'actions',
  header: 'Acciones',
  enableColumnFilter: false,
  enableGlobalFilter: false,
  cell: () => <Actions />,
}
```

Esto es lo recomendado para columnas de botones, menus o contenido visual que no debe participar en busqueda.

## Alineacion

```tsx
{
  accessorKey: 'total',
  header: 'Total',
  meta: {
    align: 'right',
    filterVariant: 'number',
  },
}
```

`align` acepta `left`, `center` o `right`.

## Rendimiento

- Mantener `columns` en `useMemo` cuando se crean dentro de un componente.
- Mantener `data` estable si viene de un store, query o generador local.
- `makeData(10_000)` sirve para probar rendimiento de render, filtros y paginacion sin cargar librerias grandes.
- `@faker-js/faker` sigue disponible como dependencia de desarrollo, pero no conviene importarlo directo en rutas productivas porque aumenta el bundle y ensucia la medicion de rendimiento de la tabla.

Ejemplo:

```tsx
const data = React.useMemo(() => makeData(10_000), []);

const columns = React.useMemo<ColumnDef<Person, unknown>[]>(
  () => [
    // columnas
  ],
  [],
);
```

## Recomendaciones de uso

- Para paginas reales, define el tipo de fila en el modulo: `User`, `Meter`, `Invoice`, etc.
- Evita crear columnas inline dentro del JSX si tienen celdas complejas.
- Usa `DataTable` como componente base compartido y deja `MainTable` como demo o wrapper temporal.
- No agregues logica de negocio dentro de `DataTable`; las acciones de editar, borrar o exportar deben venir desde las columnas o `toolbarRight`.
