import { defineOptions } from 'shared/utils/define-options';

export const EntityStatus = defineOptions([
  { value: 'active', label: 'Activo' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'inactive', label: 'Inactivo' },
] as const);

export type EntityStatusValue = (typeof EntityStatus.values)[number];
