import type { ApiResponse } from 'shared/types/api-reponse';
import type { EntityStatusValue } from 'shared/types/shared-types';
import { defineOptions } from 'shared/utils/define-options';

export const RoleName = defineOptions([
  {
    value: 'ADMIN',
    label: 'Admin',
  },
  {
    value: 'USER',
    label: 'Usuario',
  },
  {
    value: 'TECHNICAL',
    label: 'Técnico',
  },
  {
    value: 'READER',
    label: 'Lecturador',
  },
] as const);

export type RoleType = (typeof RoleName.values)[number];

export interface Roles {
  items: Role[];
}

export interface Role {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  role: string;
  description: string;
  status: EntityStatusValue;
}

export type RoleResponse = ApiResponse<Role>;
export type RolesResponse = ApiResponse<Roles>;
