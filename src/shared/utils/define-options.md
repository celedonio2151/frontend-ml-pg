# Centralizador de opciones para enums, selects, Zod y TypeScript

## Objetivo

En aplicaciones React con TypeScript es común repetir los mismos valores en varios lugares:

- `value` para enviar al backend.
- `label` para mostrar al usuario.
- valores reales para validar con Zod.
- tipos TypeScript para asegurar que solo se usen valores permitidos.
- opciones para componentes `Select`, `Autocomplete`, tablas y filtros.

Este patrón centraliza todo en una sola fuente de verdad usando una utilidad llamada `defineOptions`.

---

## Problema que resuelve

Sin un centralizador, normalmente terminamos con código repetido:

```ts
const ProfileUserTypeValues = ['student', 'professional', 'personal'] as const;

const PROFILE_USER_TYPE_LABELS = {
  student: 'Estudiante',
  professional: 'Profesional',
  personal: 'Personal',
};

type ProfileUserType = 'student' | 'professional' | 'personal';
```

El problema es que si luego se agrega otro valor, por ejemplo `teacher`, hay que actualizar varios archivos manualmente. Eso aumenta el riesgo de errores.

Con `defineOptions`, se declara una sola vez:

```ts
export const ProfileUserType = defineOptions([
  { value: 'student', label: 'Estudiante' },
  { value: 'professional', label: 'Profesional' },
  { value: 'personal', label: 'Personal' },
] as const);
```

Y desde ahí se obtiene:

```ts
ProfileUserType.options;
ProfileUserType.values;
ProfileUserType.schema;
ProfileUserType.getLabel();
ProfileUserType.labelMap;
```

---

## Cuándo usar este patrón

Usar este patrón para catálogos simples que cumplen estas condiciones:

- El backend espera un string controlado.
- El frontend debe mostrar un texto más amigable.
- Se necesita validar el valor con Zod.
- Se necesita reutilizar el mismo catálogo en formularios, tablas, filtros o interfaces.

Ejemplos:

- Estado de entidad: `active`, `inactive`, `pending`.
- Tipo de perfil: `student`, `professional`, `personal`.
- Tipo de sucursal: `coffee`, `cook`, `dinning`.
- Origen de inscripción.
- Roles de usuario.
- Estados de pago.
- Estados de orden.

---

## Cuándo no usar este patrón

No usarlo para datos dinámicos que vienen desde base de datos o API, como:

- lista de usuarios.
- lista de sucursales.
- lista de productos.
- lista de categorías administrables.
- permisos dinámicos.

Para esos casos, el catálogo debe venir desde el backend.

---

## Archivo recomendado

Crear una utilidad compartida:

```txt
src/shared/utils/define-options.ts
```

También puede ubicarse en:

```txt
src/shared/constants/define-options.ts
src/shared/lib/define-options.ts
src/shared/utils/options.ts
```

La ubicación depende de la estructura del proyecto.

---

## Implementación de `defineOptions`

```ts
import { z } from 'zod';

export function defineOptions<const T extends readonly { value: string; label: string }[]>(options: T) {
  type Value = T[number]['value'];

  const values = options.map((option) => option.value) as [Value, ...Value[]];

  const labelMap = Object.fromEntries(options.map((option) => [option.value, option.label])) as Record<Value, string>;

  const getLabel = (value?: string | null, fallback = '—') => {
    if (!value) return fallback;

    return labelMap[value as Value] ?? fallback;
  };

  const schema = z.enum(values);

  return {
    options,
    values,
    labelMap,
    getLabel,
    schema,
  };
}
```

---

## Por qué no usar clases

Para este caso no se recomienda usar clases porque:

- No se necesita estado mutable.
- No se necesitan instancias complejas.
- No se necesita herencia.
- Un objeto constante es más simple de leer y mantener.
- Funciona mejor como utilidad compartida.
- Es más natural en React y TypeScript.

Este patrón es más parecido a una factory function: recibe opciones y devuelve utilidades derivadas.

---

## Conceptos importantes

### Zod necesita valores reales

Zod valida datos en tiempo de ejecución. Por eso necesita valores que existan en JavaScript:

```ts
const values = ['active', 'inactive'] as const;

const schema = z.enum(values);
```

Esto sí existe cuando la aplicación corre.

En cambio, esto no sirve para Zod:

```ts
type Status = 'active' | 'inactive';
```

Los tipos de TypeScript desaparecen al compilar, por lo que Zod no puede validar usando solo un `type`.

---

### TypeScript necesita tipos literales

Para que TypeScript entienda que los valores permitidos son:

```ts
'student' | 'professional' | 'personal';
```

y no simplemente:

```ts
string;
```

se usa `as const`.

Ejemplo:

```ts
const values = ['student', 'professional', 'personal'] as const;
```

Sin `as const`, TypeScript puede inferir `string[]`. Con `as const`, infiere una tupla de literales readonly.

---

## Ejemplo 1: Tipo de usuario de perfil

### Definición del catálogo

```ts
import { defineOptions } from 'shared/utils/define-options';

export const ProfileUserType = defineOptions([
  {
    value: 'student',
    label: 'Estudiante',
  },
  {
    value: 'professional',
    label: 'Profesional',
  },
  {
    value: 'personal',
    label: 'Personal',
  },
] as const);

export type ProfileUserTypeValue = (typeof ProfileUserType.values)[number];
```

---

### Qué expone este catálogo

```ts
ProfileUserType.options;
// [
//   { value: 'student', label: 'Estudiante' },
//   { value: 'professional', label: 'Profesional' },
//   { value: 'personal', label: 'Personal' },
// ]

ProfileUserType.values;
// ['student', 'professional', 'personal']

ProfileUserType.labelMap;
// {
//   student: 'Estudiante',
//   professional: 'Profesional',
//   personal: 'Personal',
// }

ProfileUserType.getLabel('student');
// 'Estudiante'

ProfileUserType.schema;
// Zod enum schema
```

---

## Ejemplo 2: Uso con Zod

```ts
import { z } from 'zod';
import { ProfileUserType } from 'shared/utils/constants';

export const profileSchema = z.object({
  userId: z.uuid('Invalid userId format'),
  cu: z.string().min(1, 'CU is required'),
  userType: ProfileUserType.schema,
  checkCUDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  studyCenter: z.string().min(1, 'Study center is required'),
  career: z.string().min(1, 'Career is required'),
  course: z.string().min(1, 'Course is required'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
```

---

## Ejemplo 3: Uso con mensaje personalizado en Zod

Si se necesita mensaje personalizado, se puede crear el schema aparte:

```ts
export const ProfileUserTypeSchema = ProfileUserType.schema.refine(Boolean, {
  message: 'Tipo de usuario inválido',
});
```

O directamente en el schema principal:

```ts
export const profileSchema = z.object({
  userType: ProfileUserType.schema,
});
```

Si se necesita personalizar más errores, se puede ajustar el helper para recibir opciones extra.

---

## Ejemplo 4: Uso en React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm<ProfileFormData>({
  resolver: zodResolver(profileSchema),
  defaultValues: {
    userType: 'student',
  },
});
```

---

## Ejemplo 5: Uso en Select de Material UI

```tsx
import { MenuItem, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { ProfileUserType } from 'shared/utils/constants';

<Controller
  name="userType"
  control={control}
  render={({ field, fieldState }) => (
    <TextField
      {...field}
      select
      label="Tipo de usuario"
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
      fullWidth
    >
      {ProfileUserType.options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )}
/>;
```

---

## Ejemplo 6: Uso en Select HTML nativo

```tsx
<select {...register('userType')}>
  {ProfileUserType.options.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>
```

---

## Ejemplo 7: Uso en columnas de TanStack Table

```tsx
{
  accessorFn: (row) => row.profile?.userType ?? '',
  id: 'profileType',
  header: 'Tipo perfil',
  size: 150,
  cell: ({ getValue }) => (
    <Chip
      label={ProfileUserType.getLabel(getValue<string>())}
      size="small"
      variant="outlined"
    />
  ),
  meta: {
    filterVariant: 'text',
    filterPlaceholder: 'Buscar tipo...',
  },
}
```

Nota: es mejor que `accessorFn` devuelva el valor real o un string vacío, no el fallback visual `—`.

Recomendado:

```ts
accessorFn: (row) => row.profile?.userType ?? '';
```

Evitar:

```ts
accessorFn: (row) => row.profile?.userType ?? '—';
```

El fallback visual debe vivir en el `cell`, no en el accessor. Así se evita que `—` afecte filtros, búsquedas u ordenamientos.

---

## Ejemplo 8: Uso en chips

```tsx
<Chip label={ProfileUserType.getLabel(profile.userType)} size="small" variant="outlined" />
```

---

## Ejemplo 9: Uso en filtros

```tsx
const profileTypeFilterOptions = ProfileUserType.options;
```

```tsx
<Autocomplete
  options={ProfileUserType.options}
  getOptionLabel={(option) => option.label}
  isOptionEqualToValue={(option, value) => option.value === value.value}
  renderInput={(params) => <TextField {...params} label="Tipo de perfil" />}
/>
```

---

## Ejemplo 10: Uso para enviar al backend

El valor que se envía al backend debe ser `value`.

```ts
const payload = {
  userType: formValues.userType,
};
```

Ejemplo de payload:

```json
{
  "userType": "student"
}
```

El backend no debería recibir el label:

```json
{
  "userType": "Estudiante"
}
```

El label es solo para UI.

---

## Ejemplo 11: Uso como tipo en interfaces

```ts
export interface IProfile {
  id: string;
  userType: ProfileUserTypeValue;
}
```

También se puede usar en DTOs:

```ts
export interface CreateProfileDto {
  userId: string;
  cu: string;
  userType: ProfileUserTypeValue;
}
```

Si alguien intenta usar un valor inválido:

```ts
const userType: ProfileUserTypeValue = 'admin';
```

TypeScript marcará error, porque `admin` no pertenece al catálogo.

---

## Ejemplo 12: Estado de entidad

```ts
export const EntityStatus = defineOptions([
  {
    value: 'active',
    label: 'Activo',
  },
  {
    value: 'inactive',
    label: 'Inactivo',
  },
  {
    value: 'pending',
    label: 'Pendiente',
  },
] as const);

export type EntityStatusValue = (typeof EntityStatus.values)[number];
```

Uso con Zod:

```ts
export const schema = z.object({
  status: EntityStatus.schema,
});
```

Uso en Select:

```tsx
{
  EntityStatus.options.map((option) => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ));
}
```

Uso en Chip:

```tsx
<Chip label={EntityStatus.getLabel(status)} />
```

Uso en interface:

```ts
export interface IEntity {
  id: string;
  status: EntityStatusValue;
}
```

---

## Ejemplo 13: Tipo de sucursal

```ts
export const BranchCenterType = defineOptions([
  {
    value: 'coffee',
    label: 'Cafetería',
  },
  {
    value: 'cook',
    label: 'Cocina',
  },
  {
    value: 'dinning',
    label: 'Comedor',
  },
] as const);

export type BranchCenterTypeValue = (typeof BranchCenterType.values)[number];
```

Uso:

```ts
export const branchSchema = z.object({
  centerType: BranchCenterType.schema,
});
```

```tsx
<Chip label={BranchCenterType.getLabel(branch.centerType)} />
```

---

## Ejemplo 14: Helper con mensaje personalizado opcional

Si se quiere centralizar también el mensaje de error, se puede ampliar el helper:

```ts
import { z } from 'zod';

type DefineOptionsConfig = {
  requiredError?: string;
};

export function defineOptions<const T extends readonly { value: string; label: string }[]>(
  options: T,
  config?: DefineOptionsConfig,
) {
  type Value = T[number]['value'];

  const values = options.map((option) => option.value) as [Value, ...Value[]];

  const labelMap = Object.fromEntries(options.map((option) => [option.value, option.label])) as Record<Value, string>;

  const getLabel = (value?: string | null, fallback = '—') => {
    if (!value) return fallback;

    return labelMap[value as Value] ?? fallback;
  };

  const schema = z.enum(values, {
    message: config?.requiredError,
  });

  return {
    options,
    values,
    labelMap,
    getLabel,
    schema,
  };
}
```

Uso:

```ts
export const EntityStatus = defineOptions(
  [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'pending', label: 'Pendiente' },
  ] as const,
  {
    requiredError: 'El estado es requerido',
  },
);
```

---

## Ejemplo 15: Organización recomendada de archivos

Una estructura simple:

```txt
src/
  shared/
    utils/
      define-options.ts
    constants/
      entity-status.constants.ts
      profile-user-type.constants.ts
      branch-center-type.constants.ts
```

Ejemplo:

```txt
src/shared/constants/profile-user-type.constants.ts
```

```ts
import { defineOptions } from '../utils/define-options';

export const ProfileUserType = defineOptions([
  { value: 'student', label: 'Estudiante' },
  { value: 'professional', label: 'Profesional' },
  { value: 'personal', label: 'Personal' },
] as const);

export type ProfileUserTypeValue = (typeof ProfileUserType.values)[number];
```

Archivo barrel opcional:

```txt
src/shared/constants/index.ts
```

```ts
export * from './entity-status.constants';
export * from './profile-user-type.constants';
export * from './branch-center-type.constants';
```

Uso:

```ts
import { ProfileUserType, EntityStatus } from 'shared/constants';
```

---

## Ejemplo 16: Convenciones de nombre

Recomendado:

```ts
ProfileUserType;
EntityStatus;
BranchCenterType;
EnrollmentSource;
```

Tipos:

```ts
ProfileUserTypeValue;
EntityStatusValue;
BranchCenterTypeValue;
EnrollmentSourceValue;
```

Evitar nombres ambiguos como:

```ts
PROFILE_USER_TYPE_LABELS;
PROFILE_USER_TYPE_VALUES;
PROFILE_USER_TYPES;
```

Con `defineOptions`, el nombre principal ya representa todo el catálogo.

---

## Ejemplo 17: Uso en formularios create y update

Schema de creación:

```ts
export const createProfileSchema = z.object({
  userId: z.uuid(),
  userType: ProfileUserType.schema,
  status: EntityStatus.schema,
});
```

Schema de actualización parcial:

```ts
export const updateProfileSchema = createProfileSchema.partial();
```

Tipos:

```ts
export type CreateProfileFormData = z.infer<typeof createProfileSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
```

Importante:

```ts
Partial<CreateProfileFormData>;
```

solo cambia TypeScript, no cambia la validación real de Zod.

Para que Zod acepte campos opcionales, se debe usar:

```ts
createProfileSchema.partial();
```

---

## Ejemplo 18: Uso en componente reutilizable

```tsx
type AppSelectOption = {
  value: string;
  label: string;
};

type AppSelectProps = {
  label: string;
  value: string;
  options: readonly AppSelectOption[];
  onChange: (value: string) => void;
};

export function AppSelect({ label, value, options, onChange }: AppSelectProps) {
  return (
    <TextField select label={label} value={value} onChange={(event) => onChange(event.target.value)} fullWidth>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
```

Uso:

```tsx
<AppSelect label="Tipo de usuario" value={field.value} options={ProfileUserType.options} onChange={field.onChange} />
```

---

## Ejemplo 19: Validar manualmente un valor

```ts
const result = ProfileUserType.schema.safeParse(input);

if (!result.success) {
  console.log('Tipo inválido');
}

const userType = result.data;
```

---

## Ejemplo 20: Mostrar label en reportes o vistas de detalle

```tsx
<Typography>{ProfileUserType.getLabel(profile.userType)}</Typography>
```

---

## Checklist para agregar un nuevo catálogo

1. Crear el catálogo con `defineOptions`.
2. Exportar el tipo `XValue`.
3. Usar `X.schema` en Zod.
4. Usar `X.options` en selects.
5. Usar `X.getLabel()` en tablas, chips y vistas.
6. Usar `XValue` en interfaces y DTOs.
7. No duplicar arrays de values ni objetos de labels.

---

## Checklist para agregar un nuevo valor

Ejemplo: agregar `teacher` a `ProfileUserType`.

Solo se modifica el catálogo:

```ts
export const ProfileUserType = defineOptions([
  { value: 'student', label: 'Estudiante' },
  { value: 'professional', label: 'Profesional' },
  { value: 'personal', label: 'Personal' },
  { value: 'teacher', label: 'Docente' },
] as const);
```

Después de esto, automáticamente queda disponible en:

- Zod.
- TypeScript.
- Selects.
- Chips.
- Tablas.
- Filtros.
- Interfaces.

---

## Buenas prácticas

- Mantener `value` alineado con el backend.
- Mantener `label` orientado al usuario.
- No enviar `label` al backend.
- No usar fallback visual como valor de tabla.
- No duplicar values en archivos separados.
- Usar `as const` en cada catálogo.
- Usar `schema.partial()` para updates parciales.
- Usar el tipo derivado para DTOs e interfaces.
- Mantener los catálogos simples y estáticos.

---

## Resumen

`defineOptions` permite definir catálogos estáticos una sola vez y reutilizarlos en toda la aplicación.

Desde una sola declaración se obtiene:

```ts
options; // UI selects
values; // arrays de valores reales
schema; // validación Zod
getLabel; // tablas, chips, vistas
labelMap; // acceso directo por value
type; // tipos TypeScript derivados
```

Este patrón reduce duplicación, mejora el tipado y facilita mantener catálogos cuando el proyecto crece.
