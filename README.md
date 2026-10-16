# AquaAdmin — Frontend

Panel de administración web para la gestión de un sistema comunitario de agua potable. Proyecto de grado.

Permite administrar socios, medidores, lecturas mensuales, facturación (incluido el cobro por QR bancario), tesorería, gastos, tarifas, mesa directiva, reuniones y la configuración del sistema.

## Módulos

| Módulo | Qué hace |
| --- | --- |
| Usuarios y roles | Alta y edición de socios, asignación de roles (ADMIN, USER, TECHNICIAN, READER) |
| Medidores | Registro de medidores, cambio de propietario |
| Lecturas | Registro mensual de lecturas, con vista previa del saldo a pagar |
| Facturas | Listado, detalle, pago manual o por **QR** (con verificación automática del pago) y morosos |
| Tesorería | Movimientos de caja, saldo, resumen por periodo y ajustes manuales |
| Gastos | Registro, aprobación y rechazo de gastos |
| Tarifas | Tramos de cobro por consumo (m³) y simulador de saldo |
| Mesa directiva | Designación de cargos por periodo |
| Reuniones | Registro de reuniones y actas |
| Reportes | Reportes y gráficos de consumo y cobranza |
| Configuración | Parámetros del sistema (morosidad, QR, datos de la comunidad) |
| Mi cuenta | Perfil, medidores y lecturas del usuario autenticado |

## Tecnologías

- **React 19** + **TypeScript** + **Vite**
- **MUI 9** (Material UI) y **MUI X Date Pickers** para la interfaz
- **TanStack Query** para el estado del servidor y **TanStack Table v8** para las tablas
- **React Hook Form** + **Zod** para formularios y validación
- **React Router**, **Zustand** (sesión), **Axios**, **Day.js**, **ECharts**
- **Oxlint** como linter y **Vitest** + **Testing Library** para pruebas

> **TanStack Table está fijado en v8** (`^8.21.3`). La v9 es una reescritura con cambios incompatibles (features explícitas, `useTable`, nuevos genéricos en los tipos); migrar requiere actualizar los componentes de tabla de `src/components/MainTable*`.

## Requisitos

- Node.js 24 o superior
- pnpm 11 o superior
- El backend (API REST) en ejecución

## Instalación

```bash
pnpm install
```

Crea un archivo `.env` en la raíz con:

```bash
# URL base de la API (por defecto: http://localhost:3000/api/v1)
VITE_API_URL=http://localhost:3000/api/v1
# Puerto del servidor de desarrollo (por defecto: 3002)
VITE_PORT=3002
```

## Scripts

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo con recarga en caliente |
| `pnpm build` | Verifica tipos (`tsc -b`) y genera el build de producción en `dist/` |
| `pnpm preview` | Sirve localmente el build de producción |
| `pnpm lint` | Analiza el código con Oxlint |

## Estructura

```
src/
├── app/            # Proveedores globales (tema, React Query, fechas)
├── components/     # Componentes reutilizables (FormDialog, tablas, etc.)
├── layouts/        # Layout principal (sidebar, topbar) y de autenticación
├── modules/        # Un módulo por dominio: pages, components, hooks, services, types, schemas
├── router/         # Rutas y paths de la aplicación
├── shared/         # Hooks, utilidades, cliente HTTP y UI compartida
└── theme/          # Tema de MUI: paleta, tipografía y personalización de componentes
```

Cada módulo de `src/modules` sigue la misma organización: `services` (llamadas a la API), `hooks` (TanStack Query), `types`, `schemas` (Zod), `components` y `pages`.

## Convenciones

- **Estilos globales en el tema:** la apariencia base de los componentes de MUI se define en `src/theme/components/` (un archivo por componente). En las pantallas solo se pasan props con significado (`color`, `size`, `variant`) en lugar de repetir `sx`.
- **Llamadas a la API:** se hacen mediante el `httpClient` de `src/shared/lib/http-client.ts`, que agrega el token, desempaqueta las respuestas y normaliza los errores en `ApiError`.
- **Relaciones de la API:** los listados y detalles piden explícitamente sus relaciones con el parámetro `include` (por ejemplo `include=reading,meter`).

## API

La especificación OpenAPI del backend está en [`api-doc.json`](./api-doc.json).
