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
    value: 'TECHNICIAN',
    label: 'Técnico',
  },
  {
    value: 'READER',
    label: 'Lecturador',
  },
] as const);

export type RoleType = (typeof RoleName.values)[number];

export type RolesList = {
  items: Role[];
};

export type Role = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: RoleType;
  description: string;
  status: boolean;
};

export type UpdateRoleDto = {
  description: string;
};
